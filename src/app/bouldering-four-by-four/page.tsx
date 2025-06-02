"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  X,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Zap,
  Coffee,
  Eye,
  EyeOff,
  Flag,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Problem {
  id: number;
  name: string;
  grade: string;
  flashed: boolean;
}

interface Round {
  id: number;
  problems: Problem[];
  completed: boolean;
}

interface WorkoutStats {
  currentRound: number;
  totalRounds: number;
  flashedProblems: number;
  totalProblems: number;
  flashRate: number;
}

type WorkoutPhase = "setup" | "work" | "rest" | "completed";

interface TrainingType {
  id: string;
  name: string;
  goal: string;
  description: string;
  benefits: string[];
  icon: string;
}

const GRADES = [
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V11",
  "V12+",
];

const TRAINING_TYPES: TrainingType[] = [
  {
    id: "classic",
    name: "Classic 4×4 (Power Endurance Focus)",
    goal: "Maintain high output under fatigue",
    description: "All 4 problems should be at or slightly below your max",
    benefits: [
      "Builds power endurance",
      "Simulates pump buildup with short rests (<15 sec)",
      "High intensity training",
      "Improves performance under fatigue",
    ],
    icon: "",
  },
  {
    id: "descending",
    name: "Descending Difficulty (Fatigue Management)",
    goal: "Build volume while staying consistent",
    description: "Start hard, get easier as you fatigue",
    benefits: [
      "Great for beginners or comeback training",
      "Builds confidence",
      "Easier to complete consistently",
      "Good volume builder",
    ],
    icon: "",
  },
  {
    id: "ascending",
    name: "Ascending Difficulty (Mental Focus)",
    goal: "Train focus and control when tired",
    description: "Start easy, get harder as you fatigue",
    benefits: [
      "Trains mental toughness",
      "Improves technique under fatigue",
      "Forces calm climbing when tired",
      "Most challenging to complete cleanly",
    ],
    icon: "",
  },
  {
    id: "equal",
    name: "Equal Grade (Consistency Challenge)",
    goal: "Emphasize precision and endurance at a single level",
    description: "All problems at the same grade",
    benefits: [
      "Simple progress tracking",
      "Consistent difficulty",
      "Pure endurance focus",
      "Easy to measure improvement",
    ],
    icon: "",
  },
];

export default function BoulderingFourByFour() {
  const [maxGrade, setMaxGrade] = useState<string>("V4");
  const [trainingType, setTrainingType] = useState<string>("descending");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [workoutPhase, setWorkoutPhase] = useState<WorkoutPhase>("setup");
  const [timeRemaining, setTimeRemaining] = useState<number>(5); // 5 seconds for testing
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isGuideCollapsed, setIsGuideCollapsed] = useState<boolean>(false);
  const [roundTimes, setRoundTimes] = useState<{ [roundId: number]: number }>(
    {}
  );

  // Helper function to get color based on grade difficulty relative to max grade
  const getGradeColor = (grade: string, maxGrade: string) => {
    const gradeIndex = GRADES.indexOf(grade);
    const maxIndex = GRADES.indexOf(maxGrade);
    const difference = gradeIndex - maxIndex;

    if (difference > 0) {
      // Above max grade
      return "text-red-400";
    } else if (difference === 0) {
      // At max grade
      return "text-yellow-400";
    } else if (difference === -1) {
      // 1 grade below max
      return "text-green-400";
    } else {
      // 2 or more grades below max
      return "text-blue-400";
    }
  };

  // Helper function to get background color based on grade difficulty relative to max grade
  const getGradeBgColor = (grade: string, maxGrade: string) => {
    const gradeIndex = GRADES.indexOf(grade);
    const maxIndex = GRADES.indexOf(maxGrade);
    const difference = gradeIndex - maxIndex;

    if (difference > 0) {
      // Above max grade
      return "bg-red-400/20 text-red-400";
    } else if (difference === 0) {
      // At max grade
      return "bg-yellow-400/20 text-yellow-400";
    } else if (difference === -1) {
      // 1 grade below max
      return "bg-green-400/20 text-green-400";
    } else {
      // 2 or more grades below max
      return "bg-blue-400/20 text-blue-400";
    }
  };

  const TIME_REMAINING = 5;

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("training-guide-collapsed");
    if (savedState !== null) {
      setIsGuideCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      "training-guide-collapsed",
      JSON.stringify(isGuideCollapsed)
    );
  }, [isGuideCollapsed]);

  // Initialize rounds based on selected training type and max grade
  useEffect(() => {
    const getGradeDistribution = (type: string, maxGrade: string) => {
      const maxIndex = GRADES.indexOf(maxGrade);
      const grades = {
        main: maxGrade,
        easier: maxIndex > 0 ? GRADES[maxIndex - 1] : GRADES[0],
        easiest: maxIndex > 1 ? GRADES[maxIndex - 2] : GRADES[0],
        hardest: maxIndex < GRADES.length - 1 ? GRADES[maxIndex + 1] : maxGrade,
      };

      switch (type) {
        case "classic":
          // All problems at or slightly below max
          return [grades.main, grades.main, grades.easier, grades.easier];
        case "descending":
          // Start hard, get easier
          return [grades.main, grades.easier, grades.easier, grades.easiest];
        case "ascending":
          // Start easy, get harder
          return [grades.easiest, grades.easier, grades.easier, grades.main];
        case "equal":
          // All same grade (slightly below max for consistency)
          return [grades.easier, grades.easier, grades.easier, grades.easier];
        default:
          return [grades.main, grades.easier, grades.easier, grades.easiest];
      }
    };

    const gradeDistribution = getGradeDistribution(trainingType, maxGrade);

    const initialRounds: Round[] = Array.from(
      { length: 4 },
      (_, roundIndex) => ({
        id: roundIndex + 1,
        problems: gradeDistribution.map((grade, problemIndex) => ({
          id: problemIndex + 1,
          name: `Problem ${problemIndex + 1}`,
          grade: grade,
          flashed: false,
        })),
        completed: false,
      })
    );
    setRounds(initialRounds);
  }, [maxGrade, trainingType]);

  const handlePhaseComplete = useCallback(() => {
    if (workoutPhase === "work") {
      // Mark current round as completed
      setRounds((prev) =>
        prev.map((round) =>
          round.id === currentRound ? { ...round, completed: true } : round
        )
      );

      if (currentRound < 4) {
        // Transition to rest period
        setWorkoutPhase("rest");
        setTimeRemaining(TIME_REMAINING); // 4 minutes rest
        setIsRunning(true); // Explicitly ensure timer is running
      } else {
        // Workout completed - stop timer
        setWorkoutPhase("completed");
        setIsRunning(false);
      }
    } else if (workoutPhase === "rest") {
      // Transition to next work period
      setCurrentRound((prev) => prev + 1);
      setWorkoutPhase("work");
      setTimeRemaining(TIME_REMAINING);
      setIsRunning(true); // Explicitly ensure timer is running
    }
  }, [workoutPhase, currentRound]);

  // Auto-start timer when phase changes
  useEffect(() => {
    if (workoutPhase === "work" || workoutPhase === "rest") {
      setIsRunning(true);
    }
  }, [workoutPhase, timeRemaining]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // Don't call handlePhaseComplete here, do it outside
            setIsRunning(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Separate effect to handle phase completion
  useEffect(() => {
    if (
      timeRemaining === 0 &&
      !isRunning &&
      (workoutPhase === "work" || workoutPhase === "rest")
    ) {
      handlePhaseComplete();
    }
  }, [timeRemaining, isRunning, workoutPhase, handlePhaseComplete]);

  const startWorkout = () => {
    setWorkoutPhase("work");
    setIsRunning(true);
    setTimeRemaining(TIME_REMAINING);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetWorkout = () => {
    setWorkoutPhase("setup");
    setIsRunning(false);
    setCurrentRound(1);
    setTimeRemaining(TIME_REMAINING);
    setRoundTimes({});
    setRounds((prev) =>
      prev.map((round) => ({
        ...round,
        completed: false,
        problems: round.problems.map((problem) => ({
          ...problem,
          flashed: false,
        })),
      }))
    );
  };

  const finishRoundEarly = () => {
    if (workoutPhase === "work") {
      // Log the remaining time for this round
      setRoundTimes((prev) => ({
        ...prev,
        [currentRound]: timeRemaining,
      }));

      // Mark current round as completed
      setRounds((prev) =>
        prev.map((round) =>
          round.id === currentRound ? { ...round, completed: true } : round
        )
      );

      if (currentRound < 4) {
        // Transition to rest period
        setWorkoutPhase("rest");
        setTimeRemaining(TIME_REMAINING); // 4 minutes rest
        setIsRunning(true);
      } else {
        // Workout completed - stop timer
        setWorkoutPhase("completed");
        setIsRunning(false);
      }
    }
  };

  const toggleFlash = (roundId: number, problemId: number) => {
    setRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
              ...round,
              problems: round.problems.map((problem) =>
                problem.id === problemId
                  ? { ...problem, flashed: !problem.flashed }
                  : problem
              ),
            }
          : round
      )
    );
  };

  const updateProblemName = (
    roundId: number,
    problemId: number,
    name: string
  ) => {
    setRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
              ...round,
              problems: round.problems.map((problem) =>
                problem.id === problemId ? { ...problem, name } : problem
              ),
            }
          : round
      )
    );
  };

  const updateProblemGrade = (
    roundId: number,
    problemId: number,
    grade: string
  ) => {
    setRounds((prev) =>
      prev.map((round) =>
        round.id === roundId
          ? {
              ...round,
              problems: round.problems.map((problem) =>
                problem.id === problemId ? { ...problem, grade } : problem
              ),
            }
          : round
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedTrainingType = TRAINING_TYPES.find(
    (t) => t.id === trainingType
  );

  const toggleGuideCollapse = () => {
    setIsGuideCollapsed(!isGuideCollapsed);
  };

  return (
    <div className="min-h-screen bg-primary-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            4×4 Flash Workout
          </h1>
        </div>

        {/* Training Type & Grade Setup */}
        {workoutPhase === "setup" && (
          <div className="space-y-6 mb-6">
            {/* Training Type Selection */}
            <div className="bg-primary-700/50 rounded-lg p-6 border border-primary-500">
              <h2 className="text-xl font-semibold text-white mb-4">
                Choose Your Training Strategy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-2">
                    Training Strategy
                  </label>
                  <Select value={trainingType} onValueChange={setTrainingType}>
                    <SelectTrigger className="w-full bg-primary-500 border-primary-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRAINING_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selected Training Type Details */}
              {selectedTrainingType && (
                <div className="bg-primary-500/30 rounded-lg p-4 border border-primary-400">
                  <h4 className="font-semibold text-white mb-2">
                    {selectedTrainingType.name}
                  </h4>
                  <p className="text-primary-200 text-sm mb-3">
                    <strong>Focus:</strong> {selectedTrainingType.goal}
                  </p>
                  <div>
                    <p className="text-primary-200 text-sm font-medium mb-2">
                      This training helps with:
                    </p>
                    <ul className="text-primary-200 text-sm space-y-1">
                      {selectedTrainingType.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Grade Setup */}
            <div className="bg-primary-700/50 rounded-lg p-6 border border-primary-500">
              <h2 className="text-xl font-semibold text-white mb-4">
                Grade Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-2">
                    Your Max Grade
                  </label>
                  <Select value={maxGrade} onValueChange={setMaxGrade}>
                    <SelectTrigger className="w-full bg-primary-500 border-primary-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-2">
                    Problem Grade Distribution
                  </label>
                  <div className="bg-primary-500 rounded-md p-3 text-white">
                    <div className="text-sm">
                      {rounds.length > 0 &&
                        rounds[0].problems.map((problem, index) => (
                          <span key={index}>
                            <span
                              className={getGradeColor(problem.grade, maxGrade)}
                            >
                              {problem.grade}
                            </span>
                            {index < 3 && " • "}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button
                  onClick={startWorkout}
                  size="lg"
                  className="bg-secondary-500 hover:bg-secondary-600 w-full sm:w-auto"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start 4×4 Workout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Timer and Phase Display */}
        {workoutPhase !== "setup" && workoutPhase !== "completed" && (
          <div className="bg-primary-700/50 rounded-lg p-6 border border-primary-500 mb-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              {workoutPhase === "work" ? (
                <Zap className="w-8 h-8 text-yellow-400" />
              ) : (
                <Coffee className="w-8 h-8 text-blue-400" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {workoutPhase === "work" ? "WORK TIME" : "REST TIME"}
                </h2>
                <p className="text-primary-200">Round {currentRound} of 4</p>
              </div>
            </div>
            <div
              className={`text-6xl font-mono font-bold mb-4 ${
                timeRemaining <= 30
                  ? "text-red-400"
                  : workoutPhase === "work"
                  ? "text-yellow-400"
                  : "text-blue-400"
              }`}
            >
              {formatTime(timeRemaining)}
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={toggleTimer} variant="outline">
                {isRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              {workoutPhase === "work" && (
                <Button onClick={finishRoundEarly} variant="outline">
                  <Flag className="w-4 h-4" />
                </Button>
              )}
              <Button onClick={resetWorkout} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Round Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary-700/50 rounded-lg p-1 border border-primary-500">
            {rounds.map((round) => (
              <button
                key={round.id}
                onClick={() => setCurrentRound(round.id)}
                className={`relative px-4 py-2 rounded-md text-sm md:text-base font-medium transition-all ${
                  currentRound === round.id
                    ? "text-white underline decoration-secondary-500 decoration-2 underline-offset-4 hover:bg-primary-500"
                    : round.completed
                    ? "text-green-400 hover:bg-primary-500"
                    : "text-primary-200 hover:bg-primary-500"
                }`}
              >
                Round {round.id}
                {round.completed && (
                  <CheckCircle className="w-4 h-4 absolute -top-2 -right-2 bg-primary-700 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Round Times Display */}
        {Object.keys(roundTimes).length > 0 && (
          <div className="bg-primary-700/50 rounded-lg p-4 border border-primary-500 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(roundTimes).map(([roundId, timeLeft]) => (
                <div
                  key={roundId}
                  className="bg-primary-500/30 rounded-lg p-3 text-center border border-primary-400"
                >
                  <div className="text-sm text-primary-200 mb-1">
                    Round {roundId}
                  </div>
                  <div className="text-lg font-mono font-bold text-green-400">
                    +{formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-primary-200">time saved</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Round Problems */}
        {rounds.map(
          (round) =>
            round.id === currentRound && (
              <div
                key={round.id}
                className="bg-primary-700 rounded-lg p-6 border border-primary-500 mb-6"
              >
                <h3 className="text-xl font-semibold text-primary-200 mb-4">
                  Round {round.id} Problems
                </h3>
                <div className="space-y-4">
                  {round.problems.map((problem, index) => (
                    <div
                      key={problem.id}
                      className="bg-primary-500 rounded-lg p-4 border border-primary-500"
                    >
                      <div className="flex items-center gap-4 relative">
                        <button
                          onClick={() => toggleFlash(round.id, problem.id)}
                          className={`w-10 h-10 md:w-12 md:h-12 absolute top-0 right-0 sm:static rounded-lg border-2 transition-all ${
                            problem.flashed
                              ? "bg-green-600/20 border-green-500 text-green-400"
                              : "bg-primary-700/50 border-primary-500 text-primary-200 hover:border-primary-200"
                          }`}
                        >
                          {problem.flashed ? (
                            <CheckCircle className="w-6 h-6 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 mx-auto" />
                          )}
                        </button>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={problem.name}
                            onChange={(e) =>
                              updateProblemName(
                                round.id,
                                problem.id,
                                e.target.value
                              )
                            }
                            className="px-3 py-2 bg-primary-700 border border-primary-500 rounded-md text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            placeholder={`Problem ${index + 1}`}
                          />
                          <Select
                            value={problem.grade}
                            onValueChange={(grade) =>
                              updateProblemGrade(round.id, problem.id, grade)
                            }
                          >
                            <SelectTrigger className="w-full bg-primary-700 border border-primary-500 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {GRADES.map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium self-end sm:self-center ${getGradeBgColor(
                            problem.grade,
                            maxGrade
                          )}`}
                        >
                          {trainingType === "ascending"
                            ? index === 3
                              ? "Hardest"
                              : index === 0
                              ? "Easiest"
                              : "Medium"
                            : trainingType === "equal"
                            ? "Equal"
                            : index === 0
                            ? "Hard"
                            : index <= 2
                            ? "Medium"
                            : "Easy"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        {/* Completion Message */}
        {workoutPhase === "completed" && (
          <div className="bg-gradient-to-r from-green-600/20 to-secondary-500/20 border border-green-500/50 rounded-lg p-6 mb-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Workout Complete! 🎉
            </h2>
            <Button onClick={resetWorkout} size="lg" className="w-full">
              <RotateCcw className="w-5 h-5 mr-2" />
              Start New Workout
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-primary-500 rounded-lg p-6 border border-primary-500">
          <div
            className={`flex items-center justify-between ${
              isGuideCollapsed ? "mb-0" : "mb-3"
            }`}
          >
            <h3 className="text-lg font-semibold text-primary-200">
              Training Strategy Guide
            </h3>
            <button
              onClick={toggleGuideCollapse}
              className="p-2 rounded-md hover:bg-primary-400/30 transition-colors"
              aria-label={isGuideCollapsed ? "Show guide" : "Hide guide"}
            >
              {isGuideCollapsed ? (
                <EyeOff className="w-5 h-5 text-primary-200" />
              ) : (
                <Eye className="w-5 h-5 text-primary-200" />
              )}
            </button>
          </div>

          {!isGuideCollapsed && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {TRAINING_TYPES.map((type) => (
                  <div key={type.id} className="space-y-2">
                    <h4 className="font-medium text-white">{type.name}</h4>
                    <p className="text-primary-200 text-sm">
                      <strong>Goal:</strong> {type.goal}
                    </p>
                    <ul className="text-primary-200 text-sm space-y-1">
                      {type.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-primary-400 pt-4">
                <h4 className="font-medium text-primary-200 mb-2">
                  General 4×4 Rules
                </h4>
                <ul className="space-y-1 text-primary-200 text-sm">
                  <li>
                    • <strong>4 Rounds:</strong> Complete 4 work periods with 4
                    minutes rest between
                  </li>
                  <li>
                    • <strong>Flash Focus:</strong> Choose problems you can
                    realistically do on first attempt
                  </li>
                  <li>
                    • <strong>Short Rests:</strong> Keep transitions between
                    problems under 15 seconds for power endurance
                  </li>
                  <li>
                    • <strong>Efficient Movement:</strong> Focus on smooth,
                    controlled climbing during work periods
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
