# 🤖 AI Interview Taker

A comprehensive AI-powered interview practice platform that helps developers prepare for technical interviews across various domains and technologies.

![AI Interview Taker](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## 🌐 Live Demo

**[Try AI Interview Taker](https://ai-interview-taker-steel.vercel.app/)**

## 🌟 Features

### 🎯 **Smart Interview System**
- **Multi-Domain Support**: Frontend, Backend, Full-Stack, Mobile, DevOps, Data Science, AI/ML, and more
- **Technology-Specific Questions**: Choose from 50+ technologies including React, Node.js, Python, AWS, Docker, etc.
- **Experience-Based Difficulty**: Questions tailored to your experience level (Entry to Principal)
- **Real-Time AI Feedback**: Instant scoring and detailed feedback on your answers

### 📊 **Comprehensive Analytics**
- **Performance Tracking**: Monitor your progress across different domains and technologies
- **Detailed Reports**: Get insights into strengths and areas for improvement
- **Interview History**: Track all your past interviews with scores and feedback
- **PDF Export**: Download detailed interview reports for offline review

### 🎓 **Interview Preparation Hub**
- **Study Materials**: Curated topics and concepts for each domain
- **Practice Questions**: Technical, behavioral, and problem-solving questions
- **4-Week Study Plan**: Structured preparation roadmap
- **Expert Tips**: Best practices for technical interviews

### 🔒 **Secure & User-Friendly**
- **Authentication**: Secure user management with Clerk
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode Support**: Eye-friendly interface options
- **Data Privacy**: Your interview data is securely stored and private

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 15.3.4](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### **Backend & Database**
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database for storing interview data
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **Next.js API Routes** - Serverless API endpoints

### **Authentication**
- **[Clerk](https://clerk.com/)** - Complete authentication solution

### **AI Integration**
- **Google Gemini AI** - Advanced language model for interview questions and feedback
- **Custom Prompt Engineering** - Tailored prompts for different domains and experience levels

### **PDF Generation**
- **[pdf-lib](https://pdf-lib.js.org/)** - Create detailed interview reports

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Vercel](https://vercel.com/)** - Deployment platform

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **MongoDB** database
- **Clerk** account for authentication
- **Google Gemini API** key

### Installation

1. **Clone the repository**
   bash
   git clone https://github.com/pavithrakumar22/ai-interview-taker.git
   cd ai-interview-taker
 

2. **Install dependencies**
   bash
   npm install
   

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   

4. **Run the development server**
   bash
   npm run dev
   

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### 1. **Interview Setup**
- Select your target domain (Frontend, Backend, etc.)
- Choose specific technologies you want to be interviewed on
- Set your experience level

### 2. **AI-Powered Interview**
- Receive tailored questions based on your selections
- Answer questions in a chat-like interface
- Get real-time feedback and scoring

### 3. **Comprehensive Analysis**
- View detailed performance metrics
- Understand your strengths and weaknesses
- Download PDF reports for future reference

### 4. **Continuous Improvement**
- Track progress over multiple interviews
- Access study materials and preparation guides
- Follow structured learning paths

## 🔧 Configuration

### **Customizing Interview Domains**

Add new domains in `app/interview/setup/page.tsx`:

typescript
const domains = [
  { value: "your-domain", label: "Your Domain" },
  // ... existing domains
]


### **Adding New Technologies**

Extend the technologies array in the same file:

typescript
const technologies = [
  { value: "new-tech", label: "New Technology", category: "Category" },
  // ... existing technologies
]


### **Modifying AI Prompts**

Update prompt templates in `lib/promptBuilder.js` to customize AI behavior.


## 🚀 Deployment

### **Deploy to Vercel**

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic builds on push

### **Environment Variables for Production**
\`\`\`env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URI=
GEMINI_API_KEY=
\`\`\`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Vercel](https://vercel.com/)** for the amazing deployment platform
- **[Clerk](https://clerk.com/)** for seamless authentication
- **[shadcn/ui](https://ui.shadcn.com/)** for beautiful UI components
- **[Google](https://ai.google.dev/)** for Gemini AI capabilities
- **Open Source Community** for the incredible tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/pavithrakumar22/ai-interview-taker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pavithrakumar22/ai-interview-taker/discussions)
- **Email**: pavithrakumarsahu60@gmail.com

---

<div align="center">

**Built with ❤️ by [Pavithra Kumar](https://github.com/pavithrakumar22)**

[⭐ Star this repo](https://github.com/pavithrakumar22/ai-interview-taker) if you find it helpful!

</div>
