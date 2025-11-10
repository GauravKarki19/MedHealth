import React, { Component, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, User, Search, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Home from "../components/diseasePrediction/Home";
import Patient2 from "../components/diseasePrediction/Patient2";
import Symptom from "../components/diseasePrediction/Symptom";
import Disease from "../components/diseasePrediction/Disease";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import { useNavigate } from "react-router-dom";

class DP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Home",
      tab_name: "Welcome",
      tab_progress: 25,
      button_is_disabled: false,
      home_button_checked: false,
      age: localStorage.getItem("age") ? localStorage.getItem("age") : "18",
      button_name: "Next",
      gender: localStorage.getItem("gender")
        ? localStorage.getItem("gender").toUpperCase()
        : "Male",
      patient_question: localStorage.getItem("patient_question")
        ? localStorage.getItem("patient_question")
        : [],
      disease_possibility: [],
      user_symptoms: [],
      user_symptom_length: 0,
    };
    this.symptomRef = React.createRef();
  }

  get_next_page = (e) => {
    switch (this.state.current_page) {
      case "Home":
        return this.setState({
          current_page: "Patient-2",
          tab_progress: 50,
          home_nav_value: true,
          button_is_disabled: true,
          home_button_checked: true,
          button_name: "Next",
        });
      case "Patient-2":
        return this.setState({
          current_page: "Symptom",
          tab_progress: 75,
          button_name: "Finish",
          patient_nav_value: true,
          button_is_disabled: true,
          home_button_checked: true,
          user_symptom_length: 0,
          patient_question: localStorage.getItem("patient_question")
            ? JSON.parse(localStorage.getItem("patient_question"))
            : [],
        });
      case "Symptom":
        if (this.symptomRef.current) {
          this.symptomRef.current.sendSymptomsToBackend();
        }
        return this.setState({
          current_page: "Disease",
          button_name: "Retry",
          tab_progress: 100,
          symptom_nav_value: true,
          disease_nav_value: true,
          button_is_disabled: true,
          home_button_checked: true,
          patient_question: localStorage.getItem("patient_question")
            ? JSON.parse(localStorage.getItem("patient_question"))
            : [],
        });
      case "Disease":
        return this.setState({
          tab_progress: 25,
          current_page: "Home",
          button_is_disabled: false,
          home_button_checked: false,
          age: "18",
          button_name: "Next",
          gender: "Male",
          disease_possibility: [],
          user_symptoms: [],
          user_symptom_length: "",
        });
    }
  };

  patient_2_callback = async (data) => {
    let d = data.filter((key) => {
      return key.answer !== "";
    });
    let avl = data.length !== d.length;
    this.setState({
      patient_question: data,
      button_is_disabled: avl,
      symptom_nav_value: true,
    });
    localStorage.setItem("patient_question", JSON.stringify(data));
  };

  updateSymptoms = (user_symptoms) => {
    this.setState({ user_symptoms });
    this.setState({ user_symptom_length: user_symptoms.length });
    if (user_symptoms.length >= 2) {
      this.setState({ button_is_disabled: false });
    } else {
      this.setState({ button_is_disabled: true });
    }
  };

  updateDiseasePossibility = (disease_possibility) => {
    this.setState({ disease_possibility });
    if (disease_possibility.length > 0) {
      this.setState({ button_is_disabled: false });
    }
  };

  home_button_check_event = (e) => {
    if (e.target.checked === true) {
      return this.setState({
        button_is_disabled: false,
        home_button_checked: true,
        home_nav_value: true,
        patient_nav_value: true,
      });
    } else if (e.target.checked === false) {
      return this.setState({
        button_is_disabled: true,
        home_button_checked: false,
        home_nav_value: false,
        patient_nav_value: false,
      });
    }
  };

  get_previous_page = (e) => {
    switch (this.state.current_page) {
      case "Disease":
        return this.setState({
          current_page: "Symptom",
          button_name: "Finish",
          tab_progress: 75,
          disease_nav_value: false,
          user_symptoms: [],
          user_symptom_length: 0,
          button_is_disabled: false,
          home_button_checked: true,
          patient_question: this.state.patient_question,
        });
      case "Symptom":
        return this.setState({
          current_page: "Patient-2",
          tab_progress: 50,
          button_name: "Next",
          button_is_disabled: true,
          home_button_checked: true,
          patient_nav_value: false,
          disease_possibility: [],
          user_symptoms: [],
          user_symptom_length: 0,
        });
      case "Patient-2":
        return this.setState({
          current_page: "Home",
          button_name: "Next",
          home_nav_value: false,
          button_is_disabled: false,
          home_button_checked: false,
          user_symptoms: [],
          user_symptom_length: 0,
          tab_progress: 25,
        });
    }
  };

  showPage = (e) => {
    const { current_page, home_button_checked, age, gender, result } =
      this.state;
    switch (current_page) {
      case "Home":
        return (
          <Home
            isChecked={home_button_checked}
            checked={this.home_button_check_event}
          />
        );
      case "Patient-2":
        return <Patient2 callback={this.patient_2_callback} />;
      case "Symptom":
        return (
          <Symptom
            ref={this.symptomRef}
            user_symptoms={this.state.user_symptoms}
            disease_possibility={this.state.disease_possibility}
            getPossibleDisease={this.symptomInfoCallback}
            pageCallback={this.symptom_page_button_callback}
            setResult={(result) => this.setState({ result })}
            updateDiseasePossibility={this.updateDiseasePossibility}
            updateSymptoms={this.updateSymptoms}
          />
        );
      case "Disease":
        return this.state.disease_possibility.length > 0 ? (
          <Disease
            patientInfo={this.state.patient_question}
            disease_possibility={this.state.disease_possibility}
            gender={gender}
            age={age}
            result={result}
          />
        ) : (
          <div className="text-center p-4">
            <div className="flex justify-center items-center flex-col">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading disease possibility...</p>
            </div>
          </div>
        );
    }
  };

  render() {
    const {
      tab_progress,
      button_is_disabled,
      current_page,
      home_button_checked,
      button_name,
    } = this.state;

    const steps = [
      { id: 1, name: "Welcome", page: "Home", progress: 25, icon: CheckCircle2 },
      { id: 2, name: "Patient Info", page: "Patient-2", progress: 50, icon: User },
      { id: 3, name: "Symptoms", page: "Symptom", progress: 75, icon: Search },
      { id: 4, name: "Results", page: "Disease", progress: 100, icon: FileText },
    ];

    const isDarkMode = document.documentElement.classList.contains('dark');

    return (
      <div
        id="disease-prediction"
        className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50/30'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r ${
              isDarkMode
                ? 'from-white via-blue-200 to-white'
                : 'from-gray-900 via-blue-600 to-gray-900'
            } bg-clip-text text-transparent`}>
              Health Check & Disease Prediction
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Get AI-powered insights about your health based on symptoms
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className={`h-2 rounded-full overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${tab_progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-4">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isActive = tab_progress >= step.progress;
                const isCurrent = current_page === step.page;
                
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-110'
                        : isDarkMode
                          ? 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                          : 'bg-white text-gray-400 border-2 border-gray-300'
                    }`}>
                      {isActive ? <IconComponent className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={`text-xs mt-2 font-medium text-center ${
                      isActive
                        ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Main Content Card */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`rounded-2xl overflow-hidden shadow-2xl ${
              isDarkMode
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Content Area */}
            <div className="p-6 md:p-8 min-h-[400px]">
              <div className="h-full overflow-y-auto custom-scrollbar">
                {this.showPage()}
              </div>
            </div>

            {/* Divider */}
            <div className={`border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`} />

            {/* Navigation Buttons */}
            <div className="p-6 flex justify-between items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={current_page === "Home"}
                onClick={this.get_previous_page}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  current_page === "Home"
                    ? isDarkMode
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  !home_button_checked || button_is_disabled
                    ? isDarkMode
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : isDarkMode
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30'
                }`}
                disabled={!home_button_checked || button_is_disabled}
                type="submit"
                onClick={this.get_next_page}
              >
                {button_name}
              </motion.button>
            </div>
          </motion.main>
        </div>
      </div>
    );
  }
}

const DiseasePrediction = () => {
  const { isLoading, toggleLoading } = useContext(commonContext);
  const navigate = useNavigate();

  const userNotExists =
    !localStorage.getItem("username") ||
    localStorage.getItem("username") === "undefined";

  useEffect(() => {
    if (userNotExists) {
      navigate("/");
    } else {
      toggleLoading(true);
      setTimeout(() => toggleLoading(false), 2000);
    }
    // eslint-disable-next-line
  }, []);

  useScrollDisable(isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  return <DP />;
};

export default DiseasePrediction;
