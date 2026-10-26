import { GoogleGenerativeAI } from "@google/generative-ai";

export const HEALTH_SYSTEM_INSTRUCTION = `
You are "Vaidya Sahay AI" (वैद्य सहाय AI), a compassionate, intelligent, and highly capable AI Healthcare Assistant built for the MASQUERADE '26 AI chatbot competition.

YOUR IDENTITY & ROLE:
- Your name is Vaidya Sahay AI.
- You act as a warm, human-like, knowledgeable health companion and triage advisor.
- You are NOT a medical doctor, and you do not provide definitive medical diagnoses or prescribe prescription medications.
- Your mission is to provide empathetic, evidence-based health guidance, symptom evaluation, triage assessment, and healthy lifestyle education.

CORE CONVERSATIONAL BEHAVIORS:
1. Empathy First: Always acknowledge distress or discomfort kindly before asking diagnostic questions (e.g., "I'm sorry to hear you're feeling unwell.").
2. Structured Follow-up Questions: Ask 2 to 3 targeted clarification questions to understand the condition better:
   - Duration & onset (How long has this been occurring?)
   - Severity & quantitative details (e.g., specific temperature in °F/°C, pain scale 1-10)
   - Accompanying red-flag or common symptoms (cough, vomiting, shortness of breath, stiff neck, rashes, etc.)
   - Relevant background (age group, underlying conditions, current medications if relevant).
3. Context Memory: Remember previous messages in the conversation. When the user says "it started yesterday", "my fever went up", "that headache is worse", or refers to earlier statements, synthesize and track the progression accurately.
4. Clear & Accessible Formatting:
   - Use clean bullet points for multiple questions or tips.
   - Mention temperature equivalents when helpful (e.g., "102°F (38.9°C)").
   - Keep answers readable, avoid overwhelming walls of text.
5. Multilingual Fluidity:
   - If language requested is Hindi (hi), respond in warm, natural Hindi (देवनागरी).
   - If language requested is Telugu (te), respond in warm, natural Telugu (తెలుగు).
   - Otherwise respond in warm, conversational English.

CRITICAL HEALTH SAFETY & EMERGENCY PROTOCOL:
- If symptoms indicate an EMERGENCY (severe chest pain radiating to arm/jaw, severe difficulty breathing, sudden weakness or numbness on one side of face/body, coughing blood, seizure, persistent confusion, severe allergic anaphylaxis, or infant fever > 100.4°F):
  Immediately instruct the user to seek emergency care or call their local emergency number (112 / 911 / 108). Highlight the urgency clearly.
- Never guarantee a cure or fabricate medical facts.
- Always include or conclude with sensible medical disclaimers recommending consultation with a certified doctor or healthcare professional.
`;

/**
 * Intelligent Rule-Based Clinical Engine used when GEMINI_API_KEY is not supplied or fails.
 */
export function generateFallbackMedicalResponse(
  messages: Array<{ role: string; content: string }>,
  language?: string
): string {
  if (!messages || messages.length === 0) {
    if (language === "hi") {
      return "नमस्ते! मैं वैद्य सहाय हूँ 👋\nमैं आपके स्वास्थ्य संबंधी प्रश्नों में सहायता करने और आपको बेहतर स्वास्थ्य की दिशा में मार्गदर्शन देने के लिए यहाँ हूँ।";
    }
    if (language === "te") {
      return "నమస్కారం! నేను వైద్య సహాయ్ 👋\nమీ ఆరోగ్య సంబంధిత ప్రశ్నలకు సమాధానాలు ఇవ్వడానికి మరియు సరైన మార్గదర్శకత్వం అందించడానికి నేను ఇక్కడ ఉన్నాను.";
    }
    return "Hello! I'm Vaidya Sahay 👋\nI'm here to help you with your health-related questions and guide you to better health.";
  }

  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const fullText = latestUserMsg ? latestUserMsg.content.toLowerCase().trim() : "";
  const conversationHistory = messages.map((m) => m.content.toLowerCase()).join(" ");

  // Emergency detection
  if (
    fullText.includes("chest pain") ||
    fullText.includes("heart attack") ||
    fullText.includes("can't breathe") ||
    fullText.includes("cannot breathe") ||
    fullText.includes("difficulty breathing") ||
    fullText.includes("stroke") ||
    fullText.includes("paralysis") ||
    fullText.includes("coughing blood") ||
    fullText.includes("unconscious")
  ) {
    if (language === "hi") {
      return (
        "🚨 **आपातकालीन चिकित्सा चेतावनी (Emergency Alert)**\n\n" +
        "आपके द्वारा बताए गए लक्षण किसी गंभीर चिकित्सीय आपातकाल का संकेत हो सकते हैं।\n\n" +
        "कृपया तुरंत कार्रवाई करें:\n" +
        "• **तत्काल आपातकालीन सेवा पर कॉल करें (112 या 108 डायल करें)**।\n" +
        "• खुद वाहन न चलाएं, तुरंत नजदीकी अस्पताल के इमरजेंसी विभाग में पहुँचें।\n" +
        "• आरामदायक और सीधी स्थिति में बैठें।"
      );
    }
    return (
      "🚨 **URGENT MEDICAL ALERT**\n\n" +
      "The symptoms you described can indicate a serious medical emergency.\n\n" +
      "Please take immediate action:\n" +
      "• **Call emergency services immediately** (Dial 112 or 108 in India, or your local emergency line).\n" +
      "• Do not attempt to drive yourself; have someone drive you or wait for an ambulance.\n" +
      "• Sit in a comfortable, upright position to ease breathing.\n" +
      "• If you have prescribed emergency medicine (like nitroglycerin or an inhaler), use it as directed by your physician.\n\n" +
      "Please seek professional emergency medical care without delay."
    );
  }

  // Follow-up after temperature was given
  const hasTemp =
    fullText.match(/(\d{2,3}(\.\d+)?)\s*(°?f|°?c|degrees?|temp)/i) ||
    fullText.match(/(10[0-5]|9[7-9])(\.\d+)?/i);

  if (hasTemp || (conversationHistory.includes("fever") && (fullText.includes("yesterday") || fullText.includes("days") || fullText.includes("102") || fullText.includes("101") || fullText.includes("100")))) {
    const tempMatch = fullText.match(/(\d{2,3}(\.\d+)?)/);
    const tempVal = tempMatch ? parseFloat(tempMatch[1]) : 102;
    const celsius = tempVal > 60 ? ((tempVal - 32) * 5 / 9).toFixed(1) : tempVal.toFixed(1);
    const fahr = tempVal > 60 ? tempVal : (tempVal * 9 / 5 + 32).toFixed(1);

    if (language === "hi") {
      return (
        `${fahr}°F (${celsius}°C) का तापमान एक महत्वपूर्ण बुखार माना जाता है।\n\n` +
        "स्थिति को बेहतर समझने के लिए कुछ प्रश्न:\n" +
        "• क्या आपको खांसी, गले में खराश, या शरीर में गंभीर दर्द है?\n" +
        "• क्या आपको कंपकंपी (चिल्स) आ रही है या बहुत कमजोरी महसूस हो रही है?\n" +
        "• क्या आप पर्याप्त मात्रा में तरल पदार्थ पी पा रहे हैं?\n\n" +
        "**देखभाल सुझाव:** खूब पानी पिएं, आराम करें और यदि बुखार 103°F से अधिक हो या सांस लेने में तकलीफ हो, तो तुरंत डॉक्टर से मिलें।"
      );
    }

    return (
      `A temperature of ${fahr}°F (${celsius}°C) is considered a significant fever. Your symptoms provide important information for assessment.\n\n` +
      "A few more questions to understand your situation better:\n" +
      "• Do you have a cough, sore throat, or body pain?\n" +
      "• Are you having chills, severe weakness, or shivering?\n" +
      "• Do you have any chronic medical conditions or known allergies?\n" +
      "• Are you able to drink water and keep fluids down?\n\n" +
      "**General Care Guidance:**\n" +
      "• Stay well-hydrated with water, electrolyte solutions, or warm soups.\n" +
      "• Rest in a well-ventilated, comfortable room.\n" +
      "• Monitor your temperature every 4 to 6 hours.\n\n" +
      "⚠️ *If your symptoms worsen, fever exceeds 103°F (39.4°C), or you develop difficulty breathing or stiff neck, please consult a healthcare professional immediately.*"
    );
  }

  // Initial Fever inquiry
  if (fullText.includes("fever") || fullText.includes("temperature") || fullText.includes("chills") || fullText.includes("बुखार") || fullText.includes("జ్వరం")) {
    if (language === "hi") {
      return (
        "मुझे यह सुनकर दुख हुआ कि आप अस्वस्थ महसूस कर रहे हैं। 🙁\n" +
        "आपकी स्थिति को बेहतर ढंग से समझने के लिए, क्या आप मुझे बता सकते हैं:\n\n" +
        "• आपको बुखार कितने समय से है?\n" +
        "• आपका वर्तमान तापमान कितना है (यदि मापा गया हो)?\n" +
        "• क्या आपको खांसी, सिरदर्द, बदन दर्द या उल्टी जैसे अन्य लक्षण भी हैं?"
      );
    }
    return (
      "I'm sorry to hear that you're not feeling well. 🙁\n" +
      "To understand your condition better, can you please tell me:\n\n" +
      "• How long have you had the fever?\n" +
      "• What is your current temperature reading (if measured)?\n" +
      "• Are you experiencing any other symptoms like cough, sore throat, headache, body pain, or vomiting?"
    );
  }

  // Headache inquiry
  if (fullText.includes("headache") || fullText.includes("head ache") || fullText.includes("migraine") || fullText.includes("सिरदर्द") || fullText.includes("తలనొప్పి")) {
    return (
      "I'm sorry you are experiencing a headache. To help evaluate it better, could you share:\n\n" +
      "• Where is the pain located (forehead, temples, one side, or back of head)?\n" +
      "• How would you describe it: throbbing, dull ache, sharp, or pressure?\n" +
      "• Are you sensitive to bright lights or loud sounds, or feeling nauseous?\n" +
      "• Have you had adequate water and rest today?\n\n" +
      "*Resting in a quiet, dimmed room and hydrating often helps reduce tension headaches. If the headache is sudden, explosive, or accompanied by neck stiffness, seek emergency care.*"
    );
  }

  // Cough inquiry
  if (fullText.includes("cough") || fullText.includes("cold") || fullText.includes("congestion") || fullText.includes("खांसी") || fullText.includes("దగ్గు")) {
    return (
      "Coughs can be caused by viral infections, allergies, or respiratory irritation. To guide you properly:\n\n" +
      "• Is it a dry cough or a productive cough with phlegm/mucus?\n" +
      "• How many days have you had it, and is it worse at night?\n" +
      "• Do you have fever, shortness of breath, or chest tightness?\n\n" +
      "**Home Comfort Tips:**\n" +
      "• Warm salt-water gargles can soothe an irritated throat.\n" +
      "• Honey with warm water or herbal tea helps soothe the cough reflex.\n" +
      "• Keep yourself well hydrated to thin mucus secretions."
    );
  }

  // Medicine Information
  if (fullText.includes("medicine") || fullText.includes("tablet") || fullText.includes("dose") || fullText.includes("paracetamol") || fullText.includes("ibuprofen") || fullText.includes("दवा")) {
    return (
      "💊 **Medicine Guidance & Information:**\n\n" +
      "• **Over-the-Counter (OTC) Antipyretics:** Paracetamol (Acetaminophen) is commonly used for fever and mild pain relief under manufacturer instructions.\n" +
      "• **Important Precaution:** Always check the active ingredient to avoid accidental double dosing across multiple cold/fever medications.\n" +
      "• **Antibiotics:** Antibiotics are strictly prescription medications and only work against bacterial infections, never against viral colds or flu.\n" +
      "• **Safety Note:** Pregnant individuals, children, and people with liver or kidney conditions must always consult a licensed doctor or pharmacist before taking any medication."
    );
  }

  // Default response
  return (
    `Thank you for sharing that with me. I understand you are inquiring about "${latestUserMsg?.content || "your health"}".\n\n` +
    "To help me understand your condition better:\n" +
    "• How long have you been experiencing this?\n" +
    "• Has it stayed the same, improved, or gradually worsened?\n" +
    "• Are there any accompanying symptoms such as fever, fatigue, dizziness, or localized pain?\n\n" +
    "Feel free to provide more details so I can give you the most accurate general health guidance and self-care information."
  );
}

/**
 * Calls the official Google Gemini API using the provided conversation history.
 */
export async function getGeminiChatResponse(
  messages: Array<{ role: string; content: string }>,
  language?: string
): Promise<{ text: string; modelUsed: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return {
      text: generateFallbackMedicalResponse(messages, language),
      modelUsed: "Vaidya Sahay Clinical Engine (Fallback Mode)",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const langInstruction =
      language === "hi"
        ? "\n\nCRITICAL LANGUAGE DIRECTIVE: The user has selected HINDI. Please generate your entire response in clear, empathetic Hindi (Devanagari script), keeping technical medical terms clear."
        : language === "te"
        ? "\n\nCRITICAL LANGUAGE DIRECTIVE: The user has selected TELUGU. Please generate your entire response in natural, empathetic Telugu script."
        : "";

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: HEALTH_SYSTEM_INSTRUCTION + langInstruction,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const formattedHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage ? lastMessage.content : "Hello";

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(userPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      text: text || "I am here to assist you. Could you please describe your symptoms in more detail?",
      modelUsed: "gemini-1.5-flash",
    };
  } catch (error: unknown) {
    console.error("Gemini API invocation error, using clinical fallback:", error);
    return {
      text: generateFallbackMedicalResponse(messages, language),
      modelUsed: "Vaidya Sahay Clinical Engine (Auto-Recovery)",
    };
  }
}
