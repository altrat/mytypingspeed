import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, RotateCcw } from "lucide-react";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. A journey of a thousand miles begins with a single step. Practice makes perfect when you keep pushing forward.",
  "Technology changes rapidly but human nature remains constant. Innovation drives progress while creativity fuels imagination. Success comes to those who persist.",
  "Learning new skills requires dedication and patience. Every expert was once a beginner who never gave up. Small steps lead to big achievements over time.",
];

const TIME_OPTIONS = [30, 60, 120];

export const TypingTest = () => {
  const [selectedTime, setSelectedTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(selectedTime);
  const [isActive, setIsActive] = useState(false);
  const [currentText] = useState(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
  const [typedText, setTypedText] = useState("");
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!isActive && value.length > 0) {
      setIsActive(true);
    }

    setTypedText(value);

    // Count errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    if (value.length === currentText.length) {
      setIsActive(false);
      setIsFinished(true);
    }
  };

  const calculateWPM = () => {
    const timeElapsed = selectedTime - timeLeft;
    const minutes = timeElapsed / 60;
    const words = typedText.trim().split(/\s+/).length;
    return minutes > 0 ? Math.round(words / minutes) : 0;
  };

  const calculateAccuracy = () => {
    if (typedText.length === 0) return 100;
    return Math.round(((typedText.length - errors) / typedText.length) * 100);
  };

  const resetTest = () => {
    setTimeLeft(selectedTime);
    setIsActive(false);
    setTypedText("");
    setErrors(0);
    setIsFinished(false);
    inputRef.current?.focus();
  };

  const handleTimeChange = (time: number) => {
    setSelectedTime(time);
    setTimeLeft(time);
    resetTest();
  };

  const getCharacterClass = (index: number) => {
    if (index >= typedText.length) return "text-muted-foreground";
    if (typedText[index] === currentText[index]) return "text-success";
    return "text-destructive";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Time Selection */}
      <div className="flex gap-3 justify-center">
        {TIME_OPTIONS.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "secondary"}
            onClick={() => handleTimeChange(time)}
            disabled={isActive}
            className="min-w-[80px]"
          >
            {time}s
          </Button>
        ))}
      </div>

      {/* Stats Display */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <div className="text-3xl font-bold font-mono text-primary">{timeLeft}s</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">WPM</div>
            <div className="text-3xl font-bold font-mono text-foreground">{calculateWPM()}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">Accuracy</div>
            <div className="text-3xl font-bold font-mono text-foreground">{calculateAccuracy()}%</div>
          </div>
        </div>
      </Card>

      {/* Typing Area */}
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 relative">
        <div className="mb-6 text-2xl font-mono leading-relaxed select-none">
          {currentText.split("").map((char, index) => (
            <span key={index} className={getCharacterClass(index)}>
              {char}
            </span>
          ))}
        </div>
        
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleInputChange}
          disabled={isFinished || timeLeft === 0}
          className="w-full h-32 p-4 bg-secondary/50 border-2 border-border rounded-lg font-mono text-lg resize-none focus:outline-none focus:border-primary transition-colors"
          placeholder={isActive ? "" : "Start typing to begin..."}
          autoFocus
        />

        {isFinished && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center space-y-6 animate-slide-up">
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Test Complete!
              </h2>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Words Per Minute</div>
                  <div className="text-5xl font-bold text-primary">{calculateWPM()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Accuracy</div>
                  <div className="text-5xl font-bold text-accent">{calculateAccuracy()}%</div>
                </div>
              </div>
              <Button onClick={resetTest} size="lg" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Reset Button */}
      {!isFinished && (
        <div className="flex justify-center">
          <Button
            onClick={resetTest}
            variant="secondary"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};
