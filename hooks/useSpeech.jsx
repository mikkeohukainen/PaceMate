import * as Speech from "expo-speech";
import { useEffect } from "react";

const useSpeech = () => {
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        console.log(voices);
      } catch (error) {
        console.error("Error fetching voices:", error);
      }
    };
    fetchVoices();
  }, []);

  const speakString = (steps) => {
    let feedback = "";
    if (steps <= 30) {
      feedback =
        "You are terrible and you should feel bad. You only took " +
        steps.toString() +
        " steps";
    } else {
      feedback =
        "Wow. You are so amazing. You took " + steps.toString() + "steps";
    }

    Speech.speak(feedback);
  };

  return { speakString };
};

export default useSpeech;
