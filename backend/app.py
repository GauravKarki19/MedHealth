import datetime
import uuid
from flask import Flask, request, Response, redirect, render_template, send_from_directory, jsonify, url_for
import secrets
import stripe
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager
from flask_cors import CORS
import pymongo
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import json
from threading import Thread
import requests
from twilio.rest import Client
from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth
from utils.imageUploader import upload_file
from bson import ObjectId
from flask_swagger_ui import get_swaggerui_blueprint
from flasgger import Swagger
# import google.generativeai as genai
# from utils.analyzeReport import extract_text_from_pdf

load_dotenv()
secret_key = secrets.token_hex(16)

app = Flask(__name__)
swagger = Swagger(app)

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = secret_key
SECRET_KEY = os.getenv('SECRET')

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = os.getenv('PORT')
app.config['MAIL_USERNAME'] = os.getenv('HOST_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
mail = Mail(app)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
jwt = JWTManager(app)

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

# Twilio Whatsapp notification variables
URI = os.getenv("DBURL")

# Twilio Whatsapp notification variables (optional)
twilioWhatsappAccountSid = os.getenv("TWILIO_WHATSAPP_ACCOUNT_SID")
twilioWhatsappAuthToken = os.getenv("TWILIO_WHATSAPP_AUTH_TOKEN")
twilioWhatsappFrom = os.getenv("TWILIO_WHATSAPP_FROM")
if twilioWhatsappAccountSid and twilioWhatsappAuthToken:
    whatsappclient = Client(twilioWhatsappAccountSid, twilioWhatsappAuthToken)
else:
    whatsappclient = None
    print("Twilio WhatsApp configuration not found - WhatsApp features will be disabled")

# Firebase configuration (optional - only initialize if all required vars are present)
firebase_private_key = os.getenv("FIREBASE_PRIVATE_KEY")
if firebase_private_key:
    firebase_config = {
        "type": os.getenv("FIREBASE_TYPE"),
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": firebase_private_key.replace('\\n', '\n'),  
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
        "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
        "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
        "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN"),
    }

    try:
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully!")
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
    except Exception as e:
        print(f"Firebase initialization error: {e}")
else:
    print("Firebase configuration not found - Firebase features will be disabled")

# MongoDB connection (required)
if not URI:
    print("ERROR: DBURL environment variable is not set. Please set it in your .env file.")
    print("Example: DBURL=mongodb://username:password@host:port/database")
    print("Or for MongoDB Atlas: DBURL=mongodb+srv://username:password@cluster.mongodb.net/database")
    raise ValueError("DBURL environment variable is required")

try:
    client = pymongo.MongoClient(URI, server_api=ServerApi('1'))
    # Test the connection
    client.admin.command('ping')
    print("MongoDB connected successfully!")
except Exception as e:
    print(f"MongoDB connection error: {e}")
    print("Please check your DBURL in the .env file")
    raise

doctors = client.get_database("telmedsphere").doctors
patients = client.get_database("telmedsphere").patients
website_feedback = client.get_database("telmedsphere").website_feedback

YOUR_DOMAIN = os.getenv('DOMAIN') 

## Swagger specific ###
SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (ex. http://your-domain/api/docs)
API_URL = '/static/swagger.yaml'  # URL where your swagger.yaml is stored
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={ 'app_name': "Authentication API" }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
## End Swagger specific ###


# Test MongoDB connection
try:
    client.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

@app.get("/")
def getInfo():
    return "WelCome to 💖TelMedSphere server !!!! "

@app.get("/hello")
def hello_greeting():
    return "Helloo.... please feel free to explore 💖TelMedSphere & lets make it better together !!!!"

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        return Response()

def whatsapp_message(msg):
    try:
        # Extract recipient and message content from the msg dictionary
        to = msg.get('to')  
        body = msg.get('body')  

        # Prepare the message sending parameters
        message_params = {
            "from_": twilioWhatsappFrom,
            "to": to,
            "body": body
        }

        # Send the WhatsApp message
        message = whatsappclient.messages.create(**message_params)

        return {"status": "success", "message_sid": message.sid}
    
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return {"status": "error", "message": str(e)}

# Set up Gemini
# GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")
# genai.configure(api_key=GEMINI_API_KEY)
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# ----------- stripe payment routes -----------------

@app.route('/checkout')
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items = [
                {   
                    "price": "price_1MxPc3SAmG5gMbbMjAeavhpb",
                    "quantity": 1
                }
            ],
            mode="payment",
            success_url=YOUR_DOMAIN + "success",
            cancel_url = YOUR_DOMAIN + "failed"
        )
    except Exception as e:
        return str(e)
 
    return jsonify({'url': checkout_session.url})

@app.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.get_json()
        
        if not data or 'amount' not in data:
            return jsonify({'error': 'Amount is required'}), 400
            
        amount = float(data['amount'])
        
        if amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400

        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to cents
            currency='inr',
            automatic_payment_methods={
                'enabled': True,
            },
        )

        return jsonify({
            'clientSecret': intent.client_secret
        })

    except stripe.error.StripeError as e:
        # Handle Stripe-specific errors
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # Handle other errors
        print(f"Payment intent creation error: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ----------- Authentication routes ----------------

@app.route('/register', methods=['POST'])
def register():
    data = None
    cloudinary_url = None

    if 'registerer' in request.form:
        data = request.form.to_dict()

    # Firebase Google Register
    if 'id_token' in data:
        try:
            decoded_token = auth.verify_id_token(data['id_token'])
            email = decoded_token.get('email')
        except:
            return jsonify({'message': 'Invalid Firebase token'}), 401
    else:
        email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400
      
    if 'profile_picture' in request.files: 
        image_file = request.files['profile_picture']
        cloudinary_url = upload_file(image_file) 

    # Custom Register
    if data['registerer'] == 'patient':
        if doctors.find_one({'email': email}) or patients.find_one({'email': email}):
            return jsonify({'message': 'User already exists'}), 400
        
        if 'id_token' not in data:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
        
        # Default values
        data.setdefault('username', 'Patient-' + email.split('@')[0])
        data.setdefault('age', '')
        data.setdefault('gender', '')
        data.setdefault('phone', '')
        data.setdefault('cart', [])
        data.setdefault('wallet', 0)
        data.setdefault('meet', False)
        data.setdefault('wallet_history', [])
        data.setdefault('upcomingAppointments', [])
        if cloudinary_url:
            data['profile_picture'] = cloudinary_url
        if 'specialization' in data:
            del data['specialization']
        if 'doctorId' in data:
            del data['doctorId']
        
        patients.insert_one(data)

        if 'phone' in data:
            whatsapp_message({
                "to": f"whatsapp:{data['phone']}",
                "body": "Thank You for Signing up on TelMedSphere"
            })

        return jsonify({
            'message': 'User created successfully',
            "username": data["username"],
            "usertype": "patient",
            "gender": data["gender"],
            "phone": data["phone"],
            "email": data["email"],
            "age": data["age"],
            "profile_picture": data.get("profile_picture")
        }), 200
    
    elif data['registerer'] == 'doctor':
        if patients.find_one({'email': email}) or doctors.find_one({'email': email}):
            return jsonify({'message': 'User already exists'}), 400

        if 'id_token' not in data:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
        
        # Default values
        data.setdefault('username', 'Doctor-' + email.split('@')[0])
        data.setdefault('specialization', '')
        data.setdefault('gender', '')
        data.setdefault('phone', '')
        data.setdefault('appointments', 0)
        data.setdefault('stars', 0)
        data.setdefault('status', 'offline')
        data.setdefault('upcomingAppointments', [])
        data.setdefault('fee', 0)
        data.setdefault('verified', False)
        data.setdefault('cart', [])
        data.setdefault('wallet_history', [])
        data.setdefault('wallet', 0)
        data.setdefault('meet', False)
        data.setdefault('doctorId', "")
        if cloudinary_url:
            data['profile_picture'] = cloudinary_url

        doctors.insert_one(data)

        return jsonify({
            'message': 'User created successfully',
            "username": data["username"],
            "usertype": "doctor",
            "gender": data["gender"],
            "phone": data["phone"],
            "email": data["email"],
            "specialization": data["specialization"],
            "doctorId": data["doctorId"],
            "verified": data["verified"],
            "profile_picture": data.get("profile_picture")
        }), 200
    
    else:
        return jsonify({'message': 'Invalid registerer type'}), 400

@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()

    # Firebase Google Login
    if 'id_token' in data:
        try:
            decoded_token = auth.verify_id_token(data['id_token'])
            email = decoded_token.get('email')
        except:
            return jsonify({'message': 'Invalid Firebase token'}), 401
    else:
        email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    # Custom Login
    var = patients.find_one({'email': email})
    if var:
        if 'id_token' in data or ('passwd' in data and bcrypt.check_password_hash(var['passwd'], data['passwd'])):
            access_token = create_access_token(identity=email)
            return jsonify({
                'message': 'User logged in successfully',
                'access_token': access_token,
                "username": var["username"],
                "usertype": "patient",
                "gender": var["gender"],
                "phone": var["phone"],
                "email": var["email"],
                "age": var["age"],
                "profile_picture": var.get("profile_picture")
            }), 200
        return jsonify({'message': 'Invalid password'}), 400

    var = doctors.find_one({'email': email})
    if var:
        if 'id_token' in data or ('passwd' in data and bcrypt.check_password_hash(var['passwd'], data['passwd'])):
            # Update doctor status only if login is successful
            doctors.update_one({'email': email}, {'$set': {'status': 'online'}})
            access_token = create_access_token(identity=email)
            return jsonify({
                'message': 'User logged in successfully',
                'access_token': access_token,
                "username": var["username"],
                "usertype": "doctor",
                "gender": var["gender"],
                "phone": var["phone"],
                "email": var["email"],
                "specialization": var["specialization"],
                "doctorId": var["doctorId"],
                "verified": var.get("verified", False),
                "profile_picture": var.get("profile_picture")
            }), 200
        return jsonify({'message': 'Invalid password'}), 400

    return jsonify({'message': 'Invalid username or password'}), 401
        
@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data['email']
    
    # Find the document with the given email
    var = doctors.find_one({'email': email})
    
    if var:
        # If the document exists, check if 'verified' field exists
        if 'verified' not in var:
            # If 'verified' field doesn't exist, add it and set to True
            doctors.update_one({'email': email}, {'$set': {'verified': True}})
        else:
            # If 'verified' exists, just ensure it's set to True
            doctors.update_one({'email': email}, {'$set': {'verified': True}})
        
        verified = True  # Since we just set it to True
    else:
        verified = False  # If the document doesn't exist, treat as unverified
    
    return jsonify({'message': 'verification details', "verified": verified}), 200

@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data['email']
    
    user = patients.find_one({'email': email}) or doctors.find_one({'email': email})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Generate a password reset token
    token = secrets.token_urlsafe(16)

    # Store the token in the user's document with an expiration time
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    patients.update_one({'email': email}, {'$set': {'reset_token': token, 'reset_token_expiration': expiration_time}})
    doctors.update_one({'email': email}, {'$set': {'reset_token': token, 'reset_token_expiration': expiration_time}})

    # Send the token to the user's email
    reset_url = url_for('reset_password', token=token, _external=True)
    msg = Message("Password Reset Request",
                    sender=os.getenv('HOST_EMAIL'),
                    recipients=[email])
    msg.body = f"To reset your password, visit the following link: https://pratik0112-telmedsphere.vercel.app/reset-password/{token}"
    mail.send(msg)

    return jsonify({'message': 'Password reset link sent'}), 200

@app.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    new_password = data['password']
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Find the user with the token and check if it's still valid
    user = patients.find_one({'reset_token': token, 'reset_token_expiration': {'$gt': datetime.datetime.utcnow()}}) or \
           doctors.find_one({'reset_token': token, 'reset_token_expiration': {'$gt': datetime.datetime.utcnow()}})
    
    if not user:
        return jsonify({'message': 'The reset link is invalid or has expired'}), 400

    # Update the user's password and remove the reset token
    patients.update_one({'reset_token': token}, {'$set': {'passwd': hashed_password}, '$unset': {'reset_token': "", 'reset_token_expiration': ""}})
    doctors.update_one({'reset_token': token}, {'$set': {'passwd': hashed_password}, '$unset': {'reset_token': "", 'reset_token_expiration': ""}})

    return jsonify({'message': 'Password has been reset'}), 200

        
@app.route('/doc_status', methods=['PUT'])
def doc_status():
    data = request.get_json()
    user = data['email']
    doctors.update_one({'email': user}, {'$set': {'status': 'offline'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

# @app.route('/meet_end', methods=['PUT'])
# def meet_end():
#     data = request.get_json()
#     user = data['email']
#     doctor.update_one({'email': user}, {'$set': {'meet': False}})
#     return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/get_status', methods=['GET'])
def get_status():
    details = []
    count = 0
    for i in doctors.find():
        if i.get('verified', False):
            count += 1
            doctor_data = {
                "email": i.get("email", ""),
                "status": i.get("status", "offline"),
                "username": i.get("username", "Unknown Doctor"),
                "specialization": i.get("specialization", "General Medicine"),
                "gender": i.get("gender", "male"),
                "phone": i.get("phone", ""),
                "isInMeet": i.get("meet", False),
                "noOfAppointments": i.get("appointments", 0),
                "noOfStars": i.get("stars", 0),
                "id": count,
                "fee": i.get('fee', 199),
                "profilePicture": i.get("profile_picture", ""),
                # Include location if available
                "location": i.get("location", None)
            }
            details.append(doctor_data)
    return jsonify({"details": details}), 200

def send_message_async(msg):
    with app.app_context():
        mail.send(msg)
        # os.remove(os.path.join(app.root_path, 'upload', 'Receipt.pdf'))

@app.get('/media/<path:path>')
def send_media(path):
    return send_from_directory(
        directory='upload', path=path
    )

@app.route('/mail_file', methods=['POST'])
def mail_file():
    # Get form data
    demail = request.form.get("demail")
    pemail = request.form.get("pemail")
    meetLink = request.form.get("meetLink")
    f = request.files['file']
    
    # Save the uploaded file
    file_path = os.path.join(app.root_path, 'Receipt.pdf')
    f.save(file_path)

    # Upload the file to Cloudinary
    file_url = upload_file(file_path)

    if "http" not in file_url:
        return jsonify({"error": "File upload failed", "details": file_url}), 500
    
    # Retrieve patient and doctor details from the database
    pat = patients.find_one({'email': pemail})
    doc = doctors.find_one({'email': demail})

    if not pat or not doc:
        return jsonify({"error": "Doctor or Patient not found"}), 404

    appointment_found = False 

    # Find the upcoming appointment based on meetLink
    for appointment in pat.get('upcomingAppointments', []):
        if appointment.get('link') == meetLink:
            appointment['prescription'] = file_url  # Add prescription link
            appointment_found = True
            break

    for appointment in doc.get('upcomingAppointments', []):
        if appointment.get('link') == meetLink:
            appointment['prescription'] = file_url  # Add prescription link
            appointment_found = True
            break

    # If not found in upcomingAppointments, check completedMeets
    if not appointment_found:
        for appointment in pat.get('completedMeets', []):
            if appointment.get('link') == meetLink:
                appointment['prescription'] = file_url  # Add prescription link
                appointment_found = True
                break

        for appointment in doc.get('completedMeets', []):
            if appointment.get('link') == meetLink:
                appointment['prescription'] = file_url  # Add prescription link
                appointment_found = True
                break

    # If appointment was found, update the database
    if appointment_found:
        patients.update_one({'email': pemail}, {"$set": {"upcomingAppointments": pat.get('upcomingAppointments', []), "completedMeets": pat.get('completedMeets', [])}})
        doctors.update_one({'email': demail}, {"$set": {"upcomingAppointments": doc.get('upcomingAppointments', []), "completedMeets": doc.get('completedMeets', [])}})

    # Prepare the email message
    msg = Message(
        "Receipt cum Prescription for your Consultancy",
        recipients=[pemail]
    )
    
    # Render the email HTML template with patient's username
    msg.html = render_template('email.html', Name=pat['username'])
    
    # Prepare and send the WhatsApp message with the PDF link
    whatsapp_message({
        "to": f"whatsapp:{pat['phone']}",
        "body": f"Thank you for taking our consultancy. Please find your prescription here: {file_url}",
    })
    
    # Attach the receipt PDF to the email message
    with app.open_resource(file_path) as fp:
        msg.attach("Receipt.pdf", "application/pdf", fp.read())
    thread = Thread(target=send_message_async, args=(msg,))
    thread.start()

    # Delete the local file after sending the email
    try:
        os.remove(file_path)
    except Exception as e:
        print(f"Error deleting file: {e}")
    
    return jsonify({"message": "Success"}), 200

# ----------- appointment routes -----------------

@app.route('/doctor_apo', methods=['POST', 'PUT'])
def doctor_apo():
    data = request.get_json()
    email = data['demail']
    doc = doctors.find_one({'email': email})

    if request.method == 'POST':
        return jsonify({'message': 'Doctor Appointments', 'upcomingAppointments': doc['upcomingAppointments']}), 200
    else:
        doc['upcomingAppointments'].append({
            "date": data['date'],
            "time": data['time'],
            "patient": data['patient'],
            "demail": data['demail'],
            "link": data['link'],
        })
        doctors.update_one({'email': email}, {'$set': {'upcomingAppointments': doc['upcomingAppointments']}})
        return jsonify({
            'message': 'Doctor status updated successfully',
            'upcomingAppointments': doc['upcomingAppointments']
        }), 200

@app.route('/update_doctor_ratings', methods=['PUT'])
def doctor_app():
    data = request.get_json()

    # Extract from request
    pemail = data.get('pemail')
    demail = data.get('demail')
    meet_link = data.get('meetLink')
    stars = data.get('stars')

    # Validate required fields
    if not all([pemail, demail, meet_link, stars]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Find patient's upcoming appointment
    patient_doc = patients.find_one({'email': pemail, 'upcomingAppointments.link': meet_link})
    if not patient_doc:
        return jsonify({'error': 'Patient not found or appointment does not exist'}), 404

    # Find doctor's upcoming appointment
    doctor_doc = doctors.find_one({'email': demail, 'upcomingAppointments.link': meet_link})
    if not doctor_doc:
        return jsonify({'error': 'Doctor not found or appointment does not exist'}), 404

    # Retrieve the appointment object from patient's record
    appointment = next(
        (appt for appt in patient_doc.get('upcomingAppointments', []) if appt['link'] == meet_link),
        None
    )

    if not appointment:
        return jsonify({'error': 'Appointment details not found'}), 404

    # Add stars to appointment
    appointment['stars'] = stars

    # Remove appointment from patient's upcomingAppointments
    patients.update_one(
        {'email': pemail},
        {'$pull': {'upcomingAppointments': {'link': meet_link}}}
    )

    # Remove appointment from doctor's upcomingAppointments
    doctors.update_one(
        {'email': demail},
        {'$pull': {'upcomingAppointments': {'link': meet_link}}}
    )

    # Append to patient's completedMeet
    patients.update_one(
        {'email': pemail},
        {'$push': {'completedMeets': appointment}}
    )

    # Append to doctor's completedMeet
    doctors.update_one(
        {'email': demail},
        {'$push': {'completedMeets': appointment}}
    )

    # Update doctor's ratings and appointment count
    rating_update = doctors.update_one(
        {'email': demail},
        {'$inc': {'appointments': 1, 'stars': stars}}
    )

    if rating_update.matched_count == 0:
        return jsonify({'error': 'Doctor rating update failed'}), 404

    return jsonify({'message': 'Appointment completed and ratings updated successfully'}), 200

@app.route('/set_appointment', methods=['POST', 'PUT'])
def set_appointment():
    data = request.get_json()
    demail = data['demail']
    pemail = data['pemail']

    doc = doctors.find_one({'email': demail})
    pat = patients.find_one({'email': pemail})

    whatsapp_message({
        "to": f"whatsapp:{pat['phone']}",
        "body": "Your Appointment has been booked on " + data['date'] + " at "+ data['time'] + " with Dr. " + doc['username'] +"."+" "+doc['email']
    })

    return jsonify({
        'message': 'Appoitment Fixed Successfully', 
    }), 200

@app.route('/patient_apo', methods=['POST', 'PUT'])
def patient_apo():
    data = request.get_json()
    email = data['email']
    pat = patients.find_one({'email': email})

    if request.method == 'POST':
        return jsonify({'message': 'Patient Appointments', 'appointments': pat['upcomingAppointments']}), 200
    else:
        pat['upcomingAppointments'].append({
            "date": data['date'],
            "time": data['time'],
            "doctor": data['doctor'],
            "demail": data['demail'],
            "link": data['link'],
        })
        patients.update_one({'email': email}, {'$set': {'upcomingAppointments': pat['upcomingAppointments']}})
        return jsonify({'message': 'Patient status updated successfully'}), 200
    
@app.route('/completed_meets', methods=['POST'])
def completed_meets():
    data = request.get_json()

    if not data or 'useremail' not in data:
        return jsonify({"error": "Email parameter is required"}), 400

    useremail = data['useremail']

    # Check if user is a doctor
    doctor = doctors.find_one({'email': useremail}, {'completedMeets': 1, '_id': 0})
    if doctor:
        completed_meets = doctor.get('completedMeets', [])
        
        # Fetch patient usernames
        for meet in completed_meets:
            patient = patients.find_one({'email': meet.get('pemail')}, {'username': 1, '_id': 0})
            meet['patient'] = patient.get('username', 'Unknown') if patient else 'Unknown'
        
        return jsonify({"completedMeets": completed_meets}), 200

    # Check if user is a patient
    patient = patients.find_one({'email': useremail}, {'completedMeets': 1, '_id': 0})
    if patient:
        completed_meets = patient.get('completedMeets', [])
        
        # Fetch doctor usernames
        for meet in completed_meets:
            doctor = doctors.find_one({'email': meet.get('demail')}, {'username': 1, '_id': 0})
            meet['doctor'] = doctor.get('username', 'Unknown') if doctor else 'Unknown'
        
        return jsonify({"completedMeets": completed_meets}), 200

    return jsonify({"error": "User not found"}), 404

# ----------- meeting routes -----------------

@app.route('/make_meet', methods=['POST', 'PUT'])
def make_meet():
    data = request.get_json()
    demail = data.get('demail') or data.get('email')

    # Validate required fields for PUT request
    if request.method == 'PUT':
        doctors.update_one({'email': demail}, {'$set': {'link': {'link': data['link'], "name": data['patient']}}})

        required_fields = ['demail', 'pemail', 'date', 'time', 'link']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Add meet link to doctor's profile
        doctors.update_one(
            {'email': demail},
            {'$set': {'link': {'link': data['link'], 'name': data['patient']}}}
        )

        # Add to doctor's upcoming appointments
        doctors.update_one(
            {'email': demail},
            {'$push': {'upcomingAppointments': {
                'demail': data['demail'],
                'pemail': data['pemail'],
                'date': data['date'],
                'time': data['time'],
                'link': data['link']
            }}}
        )

        # Add to patient's upcoming appointments
        patients.update_one(
            {'email': data['pemail']},
            {'$push': {'upcomingAppointments': {
                'demail': data['demail'],
                'pemail': data['pemail'],
                'date': data['date'],
                'time': data['time'],
                'link': data['link']
            }}}
        )

        return jsonify({'message': 'Meet link created and appointments updated successfully'}), 200

    # Handle POST request: Retrieve doctor's meet link
    else:
        doc = doctors.find_one({'email': demail})
        return jsonify({'message': 'Meet link', 'link': doc.get('link', None)}), 200
    
@app.route('/meet_status', methods=['POST'])
def meet_status():
    data = request.get_json()
    user = data['email']
    details = doctors.find_one({'email': user})
    if details['meet'] == True:
        return jsonify({'message': 'Doctor is already in a meet', 'link': details.get('link', '')}), 208
    else:
        if data.get('link', '') == '':
            doctors.update_one({'email': user}, {'$set': {'meet': True}})
        else:
            doctors.update_one({'email': user}, {'$set': {'meet': True, 'link': data['link']}})
        return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/delete_meet', methods=['PUT'])
def delete_meet():
    data = request.get_json()
    email = data['email']
    doctors.update_one({'email': email}, {'$unset': {'link': None, 'currentlyInMeet': None}})
    doctors.update_one({'email': email}, {'$set': {'meet': False}})

    return jsonify({'message': 'Meet link deleted successfully'}), 200

@app.route('/currently_in_meet', methods=['POST', 'PUT'])
def currently_in_meet():
    data = request.get_json()
    email = data['email']
    if request.method == 'PUT':
        doctors.update_one({'email': email}, {'$set': {'currentlyInMeet': True}})
        return jsonify({'message': 'Currently in meet'}), 200
    else:
        doc = doctors.find_one({'email': email})
        return jsonify({'message': 'Currently in meet', 'curmeet': doc.get('currentlyInMeet', False)}), 200
    
# @app.route('/delete_currently_in_meet', methods=['PUT'])
# def delete_currently_in_meet():
#     data = request.get_json()
#     email = data['email']
#     return jsonify({'message': 'Not Currently in meet'}), 200
    
@app.route("/doctor_avilability", methods=['PUT'])
def doctor_avilability():
    data = request.get_json()
    demail = data['demail']
    doctors.update_one({'email': demail}, {'$set': {'status': 'online'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

# ----------- orders routes -----------------
@app.route("/add_order", methods=['POST'])
def add_order():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        orders = var.get('orders', [])
        for i in data["orders"]:
            i['key'] = str(uuid.uuid4())
            i['Ordered_on'] = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            orders.append(i)
        patients.update_one({'email': email}, {'$set': {'orders': orders}})
        return jsonify({'message': 'Order added successfully'}), 200
    else:
        var = doctors.find_one({"email":email})
        orders = var.get('orders', [])
        for i in data["orders"]:
            i['key'] = str(uuid.uuid4())
            i['Ordered_on'] = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            orders.append(i)
        doctors.update_one({'email': email}, {'$set': {'orders': orders}})
        return jsonify({'message': 'Order added successfully'}), 200
    
@app.route("/get_orders", methods=['POST'])
def get_orders():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email':email})
    if var:
        return jsonify({'message': 'Orders', 'orders': var['orders']}), 200
    else:
        var = doctors.find_one({'email': email})
        return jsonify({'message': 'Orders', 'orders': var['orders']}), 200

@app.route('/update_details', methods=['PUT'])
def update_details():
    data = None
    email = None
    usertype = None
    cloudinary_url = None

    # Handle form-data request
    if 'email' in request.form and 'usertype' in request.form:
        data = request.form.to_dict()
        email = data.get('email')
        usertype = data.get('usertype')

    if not email or not usertype:
        return jsonify({'message': 'Email and usertype are required'}), 400

    # Check if an image file is sent
    if 'profile_picture' in request.files:
        image_file = request.files['profile_picture']
        cloudinary_url = upload_file(image_file)  

    update_data = {}

    # Fields to update (only if provided in request)
    if 'username' in data:
        update_data['username'] = data['username']
    if 'phone' in data:
        update_data['phone'] = data['phone']
    if 'gender' in data:
        update_data['gender'] = data['gender']
    if 'profile_picture' in request.files:
        update_data['profile_picture'] = cloudinary_url

    if usertype == 'doctor':
        if 'specialization' in data:
            update_data['specialization'] = data['specialization']
        if 'fee' in data:
            update_data['fee'] = data['fee']
        if 'doctorId' in data:
            update_data['doctorId'] = data['doctorId']
    else:  # usertype == 'patient'
        if 'age' in data:
            update_data['age'] = data['age']

    # Handle password update separately
    if 'passwd' in data and data['passwd']:
        hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
        update_data['passwd'] = hashed_password

    # Update in MongoDB
    collection = doctors if usertype == 'doctor' else patients
    result = collection.update_one({'email': email}, {'$set': update_data})

    # Check if a document was updated
    if result.matched_count == 0:
        return jsonify({'message': 'User Not Found'}), 404

    if result.modified_count > 0:
        updated_user = collection.find_one({'email': email}) 

        response = {'message': f'{usertype.capitalize()} details updated successfully'}

        # Add only existing fields to the response
        for field in ["username", "usertype", "gender", "phone", "email", "age", "profile_picture"]:
            if field in updated_user:
                response[field] = updated_user[field]

        return jsonify(response), 200
    else:
        return jsonify({'message': 'No changes made'}), 200 

# ----------- cart routes -----------------

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        cart = var.get('cart', [])
        for i in data["cart"]:
            for j in cart:
                if j['id'] == i['id']:
                    j['quantity'] = i['quantity']
                    break
            else:
                i['key'] = str(uuid.uuid4())
                cart.append(i)
        patients.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart added successfully', 'cart': cart}), 200
    else:
        var = doctors.find_one({"email":email})
        cart = var.get('cart', [])
        for i in data["cart"]:
            for j in cart:
                if j['id'] == i['id']:
                    j['quantity'] = i['quantity']
                    break
            else:
                i['key'] = str(uuid.uuid4())
                cart.append(i)
        doctors.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart added successfully', 'cart': cart}), 200
    
@app.route("/get_cart", methods=['POST'])
def get_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email':email})
    if var:
        return jsonify({'message': 'Cart', 'cart': var.get('cart', [])}), 200
    else:
        var = doctors.find_one({'email': email})
        return jsonify({'message': 'Cart', 'cart': var.get('cart', [])}), 200

@app.route('/increase_quantity', methods=['POST'])
def increase_quantity():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        for i in var['cart']:
            if i['id'] == data['id']:
                i['quantity'] += 1
                break
        patients.update_one({'email': email}, {'$set': {'cart': var['cart']}})
        return jsonify({'message': 'Quantity increased successfully'}), 200
    else:
        var = doctors.find_one({'email': email})
        for i in var['cart']:
            if i['id'] == data['id']:
                i['quantity'] += 1
                break
        doctors.update_one({'email': email}, {'$set': {'cart': var['cart']}})
        return jsonify({'message': 'Quantity increased successfully'}), 200
    
@app.route('/decrease_quantity', methods=['POST'])
def decrease_quantity():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        for i in var['cart']:
            if i['id'] == data['id']:
                i['quantity'] -= 1
                break
        patients.update_one({'email': email}, {'$set': {'cart': var['cart']}})
        return jsonify({'message': 'Quantity increased successfully'}), 200
    else:
        var = doctors.find_one({'email': email})
        for i in var['cart']:
            if i['id'] == data['id']:
                i['quantity'] -= 1
                break
        doctors.update_one({'email': email}, {'$set': {'cart': var['cart']}})
        return jsonify({'message': 'Quantity increased successfully'}), 200
    
@app.route("/delete_cart", methods=['POST'])
def delete_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email':email})
    if var:
        cart = var['cart']
        for i in var['cart']:
            if i['id'] == data['id']:
                cart.remove(i)
        patients.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    else:
        var = doctors.find_one({'email': email})
        cart = var['cart']
        for i in var['cart']:
            if i['id'] == data['id']:
                cart.remove(i)
        doctors.update_one({'email': email}, {'$set': {'cart': cart}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    
@app.route("/delete_all_cart", methods=['POST'])
def delete_all_cart():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({"email": email})
    if var:
        patients.update_one({'email': email}, {'$set': {'cart': []}})
        return jsonify({'message': 'Cart deleted successfully'}), 200
    else:
        doctors.update_one({'email': email}, {'$set': {'cart': []}})
        return jsonify({'message': 'Cart deleted successfully'}), 200


# ----------- wallet routes -----------------

@app.route('/wallet', methods=['POST'])
def wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        wallet = var.get('wallet', 0)+round(float(data['walletAmount']))
        patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully'}), 200
    else:
        var = doctors.find_one({'email': email})
        wallet = var.get('wallet', 0)+round(float(data['walletAmount']))
        doctors.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully'}), 200

@app.route('/get_wallet', methods=['POST'])
def get_wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        return jsonify({'message': 'Wallet', 'wallet': var.get('wallet', 0)}), 200
    else:
        var = doctors.find_one({'email': email})
        return jsonify({'message': 'Wallet', 'wallet': var.get('wallet', 0)}), 200

@app.route("/debit_wallet", methods=['POST'])
def debit_wallet():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if data.get('demail', False):
        demail = data['demail']
        doc = doctors.find_one({'email': demail})
        wallet = var.get('wallet', 0)-round(float(doc.get('fee', 0)))
        patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
        return jsonify({'message': 'Wallet updated successfully', "fee":float(doc.get('fee', 0)) }), 200
    else:
        if var:
            wallet = var.get('wallet', 0)-round(float(data['walletAmount']))
            patients.update_one({'email': email}, {'$set': {'wallet': wallet}})
            return jsonify({'message': 'Wallet updated successfully'}), 200
        else:
            var = doctors.find_one({'email': email})
            wallet = var.get('wallet', 0)-round(float(data['walletAmount']))
            doctors.update_one({'email': email}, {'$set': {'wallet': wallet}})
            return jsonify({'message': 'Wallet updated successfully'}), 200
    
@app.route('/add_wallet_history', methods=['POST'])
def add_wallet_history():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        history = var.get('wallet_history', [])
        history.append(data['history'])
        patients.update_one({'email': email}, {'$set': {'wallet_history': history}})
        return jsonify({'message': 'Wallet history added successfully'}), 200
    else:
        var = doctors.find_one({'email': email})
        history = var.get('wallet_history', [])
        history.append(data['history'])
        doctors.update_one({'email': email}, {'$set': {'wallet_history': history}})
        return jsonify({'message': 'Wallet history added successfully'}), 200
    
@app.route('/get_wallet_history', methods=['POST'])
def get_wallet_history():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email': email})
    if var:
        return jsonify({'message': 'Wallet history', 'wallet_history': var.get('wallet_history', [])}), 200
    else:
        var = doctors.find_one({'email': email})
        return jsonify({'message': 'Wallet history', 'wallet_history': var.get('wallet_history', [])}), 200

#------------ feedback route ------------------------------
@app.route('/website_feedback', methods=['POST'])
def save_website_feedback():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
   
    # Extract required details
    user_email = data.get("email")
    rating = data.get("rating", 0)
    comments = data.get("comments", "")
    feedback_type = data.get("feedback_type", "")
    timestamp = data.get("timestamp", "")
    keep_it_anonymous = data.get("keep_it_anonymous", False)

    # Fetch patient details using pemail
    user = patients.find_one({"email": user_email}, {"_id": 0, "username": 1, "profile_picture": 1})
    if not user :
       user = doctors.find_one({"email": user_email}, {"_id": 0, "username": 1, "profile_picture": 1})
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    feedback_entry = {
        "user_email": user_email,
        "rating": rating,
        "comments": comments,
        "username": user.get("username", ""),  
        "profile_picture": user.get("profile_picture", ""), 
        "keep_it_anonymous": keep_it_anonymous,
        "feedback_type": feedback_type,
        "timestamp" : timestamp
    }

    try:
        website_feedback.insert_one(feedback_entry)
        return jsonify({"message": "Feedback Saved Successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/website_feedback',methods=['GET'])
def get_all_website_feedback():
    try:
        feedbacks = list(website_feedback.find({}, {"_id": 0}))
        for feedback in feedbacks:
            if feedback.get("keep_it_anonymous"):
                feedback.pop("username", None)
                feedback.pop("user_email", None)
        return jsonify(feedbacks),200
    except Exception as e:
        return jsonify({"error": str(e)}), 500       
        
@app.route('/website_feedback/<id>', methods=['GET'])
def get_website_feedback(id):
    try:
        # Convert string ID to ObjectId
        object_id = ObjectId(id)

        # Fetch feedback using the converted ObjectId
        result = website_feedback.find({'_id': object_id}, {"_id": 0})

        if result:
            if result.get("keep_it_anonymous"):
                result.pop("username", None)
                result.pop("user_email", None)
            return jsonify({"message": "Feedback found", "data": result}), 200
        else:
            return jsonify({"message": "Feedback Not Found"}), 404    

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ----------- email for contact us routes -----------------
@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    try:
        # Send email notification
        msg = Message(
            subject=f"New Contact Form Submission: {data['subject']}",
            sender=data['email'],
            recipients=["telmedsphere489@gmail.com"],
            body=f"""
            New contact form submission from:
            Name: {data['name']}
            Email: {data['email']}
            Subject: {data['subject']}
            Message: {data['message']}
            """
        )
        mail.send(msg)
        return jsonify({"message": "Message sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ----------- Analyze Report -----------------

# @app.route('/analyze_pdf', methods=['POST'])
# def analyze_pdf():
#     if 'pdf' not in request.files:
#         return jsonify({"error": "No PDF file provided"}), 400

#     # Get user input if available
#     user_input = request.form.get("user_input", "")

#     pdf_file = request.files['pdf']
#     pdf_path = os.path.join(app.root_path, 'report.pdf')
#     pdf_file.save(pdf_path)

#     extracted_text = extract_text_from_pdf(pdf_path)

#     try:
#         os.remove(pdf_path)
#     except Exception as e:
#         print(f"Error deleting file: {e}")

#     if not extracted_text:
#         return jsonify({"error": "No text extracted from PDF"}), 400
    
#     prompt = f"""
#         You are a medical assistant. Analyze the following medical lab report and summarize only the abnormal or deficient parameters.

#         Additional user info to consider: {user_input}

#         ⚠️ Return your response strictly in markdown format using the structure below for each abnormal element. Wrap the entire response inside triple backticks (```markdown). Use bullet points where indicated.

#         Format (Markdown):
#         ```
#         ### **Element - Value (Status)**
# ---

# **Concern:**
# <brief explanation>

# **Treatment Suggestions:**
# - **Diet**

#   **Veg -** <veg options>
  
#   **Non-veg -** <non-veg options>
# - **Supplements:** <recommended supplements>
# - **Tips:** <lifestyle tips>
# ```

#         Only use this format. At the end, provide a short summary (2-3 lines) what action should be taken.
        
#         Here is the lab report:
#         {extracted_text}
#         """
    
#     response = model.generate_content(prompt)
#     return jsonify({"summary": response.text})

# Disease Prediction Endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        import numpy as np
        import pandas as pd
        import pickle
        import os
        from pathlib import Path
        
        # Get the base directory
        # For Render deployment, models should be in the repository root
        # For local development, models are in ../models
        current_file = Path(__file__).resolve()
        if (current_file.parent.parent / 'models').exists():
            # Local development: models are in ../models
            models_dir = current_file.parent.parent / 'models'
        else:
            # Production: models should be in backend/models or repo root
            # Try multiple possible locations
            possible_paths = [
                current_file.parent / 'models',  # backend/models
                current_file.parent.parent / 'models',  # root/models
                Path('/app/models'),  # Docker/Render absolute path
            ]
            models_dir = None
            for path in possible_paths:
                if path.exists() and (path / 'ExtraTrees').exists():
                    models_dir = path
                    break
            
            if not models_dir:
                # Return error if models not found
                return jsonify({
                    'error': 'Disease prediction model not found',
                    'message': 'Model files are required for disease prediction. Please ensure models directory is in the repository.',
                    'searched_paths': [str(p) for p in possible_paths]
                }), 503
        
        # Check if model files exist
        model_file = models_dir / 'ExtraTrees'
        desc_file = models_dir / 'symptom_Description.csv'
        prec_file = models_dir / 'symptom_precaution.csv'
        
        if not model_file.exists():
            return jsonify({
                'error': 'Disease prediction model not found. Please ensure the model files are available.',
                'message': 'The prediction service is currently unavailable. Please contact support.'
            }), 503
        
        # Load model and data files
        try:
            model = pickle.load(open(model_file, 'rb'))
            desc = pd.read_csv(desc_file)
            prec = pd.read_csv(prec_file)
        except Exception as e:
            return jsonify({
                'error': f'Failed to load prediction model: {str(e)}',
                'message': 'The prediction service is currently unavailable. Please contact support.'
            }), 503
        
        # Disease and symptom lists
        diseases = ['(vertigo) Paroymsal Positional Vertigo', 'AIDS', 'Acne', 'Alcoholic hepatitis', 'Allergy', 'Arthritis', 'Bronchial Asthma', 'Cervical spondylosis', 'Chicken pox', 'Chronic cholestasis', 'Common Cold', 'Dengue', 'Diabetes', 'Dimorphic hemmorhoids(piles)', 'Drug Reaction', 'Fungal infection', 'GERD', 'Gastroenteritis', 'Heart attack', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E', 'Hypertension', 'Hyperthyroidism', 'Hypoglycemia', 'Hypothyroidism', 'Impetigo', 'Jaundice', 'Malaria', 'Migraine', 'Osteoarthristis', 'Paralysis (brain hemorrhage)', 'Peptic ulcer diseae', 'Pneumonia', 'Psoriasis', 'Tuberculosis', 'Typhoid', 'Urinary tract infection', 'Varicose veins', 'hepatitis A']
        
        symptoms = ['Disease', 'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition', 'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze', 'prognosis', 'skin rash', 'mood swings', 'weight loss', 'fast heart rate', 'excessive hunger', 'muscle weakness', 'abnormal menstruation', 'muscle wasting', 'patches in throat', 'high fever', 'extra marital contacts', 'yellowish skin', 'loss of appetite', 'abdominal pain', 'yellowing of eyes', 'chest pain', 'loss of balance', 'lack of concentration', 'blurred and distorted vision', 'drying and tingling lips', 'slurred speech', 'stiff neck', 'swelling joints', 'painful walking', 'dark urine', 'yellow urine', 'receiving blood transfusion', 'receiving unsterile injections', 'visual disturbances', 'burning micturition', 'bladder discomfort', 'foul smell of urine', 'continuous feel of urine', 'irregular sugar level', 'increased appetite', 'joint pain', 'skin peeling', 'small dents in nails', 'inflammatory nails', 'swelling of stomach', 'distention of abdomen', 'history of alcohol consumption', 'fluid overload', 'pain during bowel movements', 'pain in anal region', 'bloody stool', 'irritation in anus', 'acute liver failure', 'stomach bleeding', 'back pain', 'weakness in limbs', 'neck pain', 'mucoid sputum', 'mild fever', 'muscle pain', 'family history', 'continuous sneezing', 'watering from eyes', 'rusty sputum', 'weight gain', 'puffy face and eyes', 'enlarged thyroid', 'brittle nails', 'swollen extremeties', 'swollen legs', 'prominent veins on calf', 'stomach pain', 'spinning movements', 'sunken eyes', 'silver like dusting', 'swelled lymph nodes', 'blood in sputum', 'swollen blood vessels', 'toxic look (typhos)', 'belly pain', 'throat irritation', 'redness of eyes', 'sinus pressure', 'runny nose', 'loss of smell', 'passage of gases', 'cold hands and feets', 'weakness of one body side', 'altered sensorium', 'nodal skin eruptions', 'red sore around nose', 'yellow crust ooze', 'ulcers on tongue', 'spotting  urination', 'pain behind the eyes', 'red spots over body', 'internal itching']
        
        data = request.get_json(force=True)
        
        if not data:
            return jsonify({'error': 'No symptoms provided'}), 400
        
        if len(data) < 2:
            return jsonify({'error': 'At least 2 symptoms are required for accurate prediction'}), 400
        
        # Count matched symptoms
        matched_symptoms = 0
        features = [0] * len(symptoms)
        
        for symptom in data:
            # Normalize symptom name (handle both formats)
            symptom_normalized = symptom.replace(' ', '_').lower()
            symptom_original = symptom
            
            # Try both normalized and original formats
            if symptom_normalized in symptoms:
                index = symptoms.index(symptom_normalized)
                features[index] = 1
                matched_symptoms += 1
            elif symptom_original in symptoms:
                index = symptoms.index(symptom_original)
                features[index] = 1
                matched_symptoms += 1
            else:
                print(f"Symptom not found: {symptom}")
        
        if matched_symptoms < 2:
            return jsonify({'error': 'Not enough recognized symptoms. Please provide more symptoms.'}), 400
        
        # Model prediction
        try:
            proba = model.predict_proba([features])
            max_probability = max(proba[0])
            
            if max_probability < 0.1:
                return jsonify({'error': 'The symptom combination does not match known disease patterns. Please provide more specific symptoms.'}), 400
        except Exception as e:
            print(f"Model Prediction Error: {str(e)}")
            return jsonify({'error': str(e), 'message': 'Prediction failed.'}), 500
        
        # Process results
        top5_idx = np.argsort(proba[0])[-5:][::-1]
        top5_proba = np.sort(proba[0])[-5:][::-1]
        top5_diseases = [diseases[i] for i in top5_idx]
        
        response = []
        for i in range(min(3, len(top5_diseases))):
            disease = top5_diseases[i]
            probability = top5_proba[i]
            
            # Get description
            disease_desc = "No description available"
            if disease in desc["Disease"].values:
                disease_desc = desc[desc['Disease'] == disease].iloc[0][1]
            
            # Get precautions
            precautions = []
            if disease in prec["Disease"].values:
                c = prec[prec['Disease'] == disease].index[0]
                for j in range(1, len(prec.iloc[c])):
                    prec_val = prec.iloc[c, j]
                    if pd.notna(prec_val) and prec_val:
                        precautions.append(str(prec_val))
            
            response.append({
                'disease': disease,
                'probability': float(probability),
                'description': disease_desc,
                'precautions': precautions
            })
        
        return jsonify(response)
        
    except ImportError as e:
        return jsonify({
            'error': f'Required libraries not available: {str(e)}',
            'message': 'Disease prediction requires additional libraries. Please install numpy, pandas, and scikit-learn.'
        }), 503
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': 'An error occurred while predicting disease. Please try again later.'
        }), 500
