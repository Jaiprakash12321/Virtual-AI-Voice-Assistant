import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ham, setHam] = useState(false);
  
  // Refs for Web Speech API and UI
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const responseAreaRef = useRef(null);

  // Set a default welcome message when the component loads
  useEffect(() => {
    if (userData?.name) {
      setAiText(`Hello ${userData.name}, how can I help you today? Tap the microphone to speak.`);
    }
  }, [userData?.name]);


  // Check authentication
  useEffect(() => {
    if (!userData) {
      navigate('/signin');
    }
  }, [userData, navigate]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (recognitionRef.current) {
      setUserText(""); // Clear previous user text
      setAiText("");   // Clear previous AI text
      recognitionRef.current.start();
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // CHANGED: This is now the main control function for the microphone
  const toggleListening = () => {
    if (isSpeaking) {
      // Allow user to interrupt the AI
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    if (listening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const speak = (text) => {
    const synth = synthRef.current;
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi_IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    setIsSpeaking(true);
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // CHANGED: Removed startRecognition() from here to prevent the loop.
      // The assistant will now wait for the user to press the mic again.
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsSpeaking(false);
      // CHANGED: Also removed startRecognition() from here.
    };

    synth.speak(utterance);
  };

  const handleCommand = async (data) => {
    if (!data || !data.response) {
      const errorMsg = "Sorry, I couldn't process your request. Please try again.";
      setAiText(errorMsg);
      speak(errorMsg);
      return;
    }
    
    const { response } = data;
    setAiText(response);
    speak(response);
  };

  // CHANGED: This useEffect now only SETS UP the speech recognition, but does NOT start it.
  useEffect(() => {
    if (!userData || !(window.SpeechRecognition || window.webkitSpeechRecognition)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false; // CHANGED: Set to false, we only want one result.
    recognition.lang = 'en-US';
    recognition.interimResults = false; // CHANGED: We only care about the final result.

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
      console.log("Listening for a command...");
    };

    recognition.onend = () => {
      setListening(false);
      console.log("Recognition ended.");
      // CHANGED: Removed all logic that automatically restarts recognition.
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setListening(false);
    };

    // This is where the magic happens after you speak
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log("Final transcript:", transcript);
      
      setUserText(transcript); // Show what the user said
      
      // Stop listening immediately after getting the result.
      stopRecognition();

      // CHANGED: Removed wake-word check. Process the command directly.
      try {
        console.log("Calling Gemini API with:", transcript);
        const data = await getGeminiResponse(transcript);
        if (data) {
          handleCommand(data);
        } else {
          throw new Error("Empty response from API");
        }
      } catch (error) {
        console.error("API error:", error);
        const errorMsg = "Sorry, I encountered an error. Please try again.";
        setAiText(errorMsg); // Show error on screen
        speak(errorMsg);     // Speak the error
      }
    };

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [userData, getGeminiResponse]); // Dependencies are correct

  // Scroll to bottom when new messages appear
  useEffect(() => {
    if (responseAreaRef.current) {
      responseAreaRef.current.scrollTop = responseAreaRef.current.scrollHeight;
    }
  }, [userText, aiText]);

  if (!userData) {
    return <div className="w-full h-screen flex items-center justify-center text-white">
      Redirecting to login...
    </div>;
  }

  // --- JSX is mostly the same, with one small text change at the bottom ---
  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center py-4 px-2 md:py-8 md:px-4 overflow-hidden relative'>
      <CgMenuRight 
        className='lg:hidden text-white absolute top-4 right-4 w-6 h-6 z-20' 
        onClick={() => setHam(true)} 
      />
      
      <div className={`fixed lg:hidden inset-0 bg-[#000000c0] backdrop-blur-lg p-5 flex flex-col gap-5 items-start transition-transform duration-300 ${ham ? "translate-x-0" : "translate-x-full"} z-30`}>
        <RxCross1 
          className='text-white absolute top-4 right-4 w-6 h-6' 
          onClick={() => setHam(false)} 
        />
        <button 
          className='w-full py-3 px-6 text-black font-semibold bg-white rounded-full text-lg'
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button 
          className='w-full py-3 px-6 text-black font-semibold bg-white rounded-full text-lg'
          onClick={() => navigate("/customize")}
        >
          Customize Assistant
        </button>
        <div className='w-full h-px bg-gray-400 my-2' />
        <h1 className='text-white font-semibold text-lg w-full'>History</h1>
        <div className='w-full flex-1 overflow-y-auto'>
          {userData.history?.map((his, index) => (
            <div key={index} className='text-gray-200 text-base py-2 border-b border-gray-700'>
              {his}
            </div>
          ))}
        </div>
      </div>
      
      <div className='absolute top-4 right-4 hidden lg:flex gap-3'>
        <button 
          className='py-2 px-5 text-black font-semibold bg-white rounded-full text-base'
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button 
          className='py-2 px-5 text-black font-semibold bg-white rounded-full text-base'
          onClick={() => navigate("/customize")}
        >
          Customize
        </button>
      </div>
      
      <div className='flex flex-col items-center w-full max-w-4xl mt-4 md:mt-8'>
        <div className='w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4'>
          <img 
            src={userData?.assistantImage} 
            alt="Assistant" 
            className='w-full h-full object-cover'
          />
        </div>
        
        <h1 className='text-white text-xl md:text-2xl font-bold mb-2 text-center'>
          I'm {userData?.assistantName}
        </h1>
        
        <div 
          ref={responseAreaRef}
          className='w-full max-w-2xl bg-black bg-opacity-40 rounded-2xl p-4 md:p-6 mb-6 flex flex-col gap-4 min-h-[8rem] max-h-60 overflow-y-auto'
        >
          {userText && (
            <div className='flex items-start gap-3 self-end'>
              <div className='text-white text-base md:text-lg bg-blue-600 px-4 py-2 rounded-lg'>
                {userText}
              </div>
               <div className='bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0'>
                <span className='text-white font-bold'>Y</span>
              </div>
            </div>
          )}
          
          {aiText && (
            <div className='flex items-start gap-3 self-start'>
               <div className='bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0'>
                <span className='text-white font-bold'>A</span>
              </div>
              <div className='text-white text-base md:text-lg bg-gray-700 px-4 py-2 rounded-lg'>
                {aiText}
              </div>
            </div>
          )}
        </div>
        
        <div className='flex flex-col items-center mb-6'>
          {isSpeaking ? (
            <img src={aiImg} alt="AI Thinking" className='w-24 md:w-32' />
          ) : (
            <img src={userImg} alt="User" className='w-24 md:w-32' />
          )}
        </div>
        
        <div className='flex flex-col items-center gap-4 w-full'>
          <button 
            onClick={toggleListening}
            className={`flex items-center justify-center w-16 h-16 rounded-full transition-all ${
              listening 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-white hover:bg-gray-200'
            }`}
          >
            {listening ? (
              <FaMicrophone className='text-white text-2xl' />
            ) : (
              <FaMicrophoneSlash className='text-gray-800 text-2xl' />
            )}
          </button>
          
          <div className='text-white text-sm h-5'>
            {isSpeaking 
              ? `${userData?.assistantName} is speaking...`
              : listening 
                ? "Listening..." 
                : "Tap the mic to speak" // CHANGED: Simplified instruction
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;