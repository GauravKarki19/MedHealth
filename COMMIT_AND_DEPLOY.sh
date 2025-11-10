#!/bin/bash
# Script to help with committing and deploying MedHealth
# Usage: bash COMMIT_AND_DEPLOY.sh

echo "🚀 MedHealth Deployment Helper Script"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git repository not initialized. Initializing..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo "📋 Current branch: $CURRENT_BRANCH"
echo ""

# Show status
echo "📊 Current git status:"
git status --short
echo ""

# Ask user what to do
echo "What would you like to do?"
echo "1. Commit all changes with a message"
echo "2. Push to GitHub"
echo "3. Both (commit and push)"
echo "4. Exit"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
        ;;
    2)
        read -p "Enter remote name (default: origin): " remote
        remote=${remote:-origin}
        read -p "Enter branch name (default: $CURRENT_BRANCH): " branch
        branch=${branch:-$CURRENT_BRANCH}
        git push $remote $branch
        echo "✅ Changes pushed to GitHub"
        ;;
    3)
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        read -p "Enter remote name (default: origin): " remote
        remote=${remote:-origin}
        read -p "Enter branch name (default: $CURRENT_BRANCH): " branch
        branch=${branch:-$CURRENT_BRANCH}
        git push $remote $branch
        echo "✅ Changes committed and pushed to GitHub"
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Done!"

