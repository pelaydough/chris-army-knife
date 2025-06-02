"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

export default function SleepCalculator() {
  const [wakeUpTime, setWakeUpTime] = useState<{
    hour: number;
    minute: number;
    period: string;
  }>({
    hour: 7,
    minute: 30,
    period: "AM",
  });
  const [bedTimes, setBedTimes] = useState<string[]>([]);

  const [editing, setEditing] = useState<"hour" | "minute" | "period" | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTimeChange = (hour: number, minute: number, period: string) => {
    setWakeUpTime({ hour, minute, period });
  };

  const handleInputBlur = () => {
    setEditing(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (inputRef.current) {
        const value = inputRef.current.value;

        if (editing === "hour") {
          const hour = parseInt(value);
          if (!isNaN(hour) && hour >= 1 && hour <= 12) {
            handleTimeChange(hour, wakeUpTime.minute, wakeUpTime.period);
          }
        } else if (editing === "minute") {
          const minute = parseInt(value);
          if (!isNaN(minute) && minute >= 0 && minute <= 59) {
            handleTimeChange(wakeUpTime.hour, minute, wakeUpTime.period);
          }
        } else if (editing === "period") {
          const period = value.toUpperCase();
          if (period === "AM" || period === "PM") {
            handleTimeChange(wakeUpTime.hour, wakeUpTime.minute, period);
          }
        }
      }
      setEditing(null);
    }
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleCalculate = () => {
    // Convert wake-up time to minutes since midnight
    let wakeTimeInMinutes = wakeUpTime.hour * 60 + wakeUpTime.minute;
    if (wakeUpTime.period === "PM" && wakeUpTime.hour !== 12) {
      wakeTimeInMinutes += 12 * 60;
    } else if (wakeUpTime.period === "AM" && wakeUpTime.hour === 12) {
      wakeTimeInMinutes = wakeTimeInMinutes - 12 * 60;
    }

    const cycleLength = 90;
    const newBedTimes: string[] = [];

    for (let i = 1; i < 7; i++) {
      let bedTimeInMinutes = wakeTimeInMinutes - (i * cycleLength + 15);

      if (bedTimeInMinutes < 0) {
        bedTimeInMinutes += 24 * 60;
      }

      let hours = Math.floor(bedTimeInMinutes / 60);
      const minutes = bedTimeInMinutes % 60;

      let period = "AM";
      if (hours >= 12) {
        period = "PM";
        if (hours > 12) {
          hours -= 12;
        }
      }
      if (hours === 0) {
        hours = 12;
      }

      newBedTimes.push(
        `${hours}:${minutes.toString().padStart(2, "0")} ${period}`
      );
    }

    console.log(newBedTimes.reverse());
    setBedTimes(newBedTimes.reverse());
  };

  return (
    <div className="tool-container flex flex-col items-center justify-center gap-6 p-6 min-h-screen bg-navy-950">
      {!bedTimes.length && (
        <>
          <h1 className="text-2xl text-center font-semibold">
            What time do you want to wake up?
          </h1>

          <div className="flex items-center gap-3">
            <div
              className="flex flex-col items-center justify-center cursor-pointer"
              onWheel={(e) => {
                const direction = e.deltaY > 0 ? -1 : 1;
                const newHour =
                  direction > 0
                    ? wakeUpTime.hour === 12
                      ? 1
                      : wakeUpTime.hour + 1
                    : wakeUpTime.hour === 1
                    ? 12
                    : wakeUpTime.hour - 1;
                handleTimeChange(newHour, wakeUpTime.minute, wakeUpTime.period);
              }}
              onClick={() => setEditing("hour")}
            >
              {editing === "hour" ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="text-2xl font-bold w-12 text-center bg-transparent outline-none border-b border-white"
                  defaultValue={wakeUpTime.hour.toString()}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  maxLength={2}
                />
              ) : (
                <div className="text-2xl font-bold w-12 text-center">
                  {wakeUpTime.hour.toString().padStart(2, "0")}
                </div>
              )}
            </div>

            <span className="text-2xl font-bold">:</span>

            <div
              className="flex flex-col items-center justify-center cursor-pointer"
              onWheel={(e) => {
                const direction = e.deltaY > 0 ? -1 : 1;
                const newMinute = (wakeUpTime.minute + direction * 5 + 60) % 60;
                handleTimeChange(wakeUpTime.hour, newMinute, wakeUpTime.period);
              }}
              onClick={() => setEditing("minute")}
            >
              {editing === "minute" ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="text-2xl font-bold w-12 text-center bg-transparent outline-none border-b border-white"
                  defaultValue={wakeUpTime.minute.toString()}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  maxLength={2}
                />
              ) : (
                <div className="text-2xl font-bold w-12 text-center">
                  {wakeUpTime.minute.toString().padStart(2, "0")}
                </div>
              )}
            </div>

            <div
              className="flex flex-col items-center ml-2 cursor-pointer"
              onWheel={(e) => {
                const newPeriod = wakeUpTime.period === "AM" ? "PM" : "AM";
                handleTimeChange(wakeUpTime.hour, wakeUpTime.minute, newPeriod);
              }}
              onClick={() => setEditing("period")}
            >
              {editing === "period" ? (
                <input
                  ref={inputRef}
                  type="text"
                  className="text-2xl font-bold w-12 text-center bg-transparent outline-none border-b border-white"
                  defaultValue={wakeUpTime.period}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  maxLength={2}
                />
              ) : (
                <div className="text-2xl font-bold w-12 text-center">
                  {wakeUpTime.period}
                </div>
              )}
            </div>
          </div>
          <Button onClick={handleCalculate}>Calculate</Button>
        </>
      )}

      {bedTimes.length > 0 && (
        <div className="mt-6 flex flex-col items-center w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-2">Bedtime</h2>
          <p className="text-center mb-6">
            The average human takes 15 minutes to fall asleep. To wake up
            refreshed at {wakeUpTime.hour}:
            {wakeUpTime.minute.toString().padStart(2, "0")} {wakeUpTime.period},
            you need go to sleep at one of the following times:
          </p>
          <div className="grid gap-4 w-full mb-6">
            <div className="flex flex-col md:flex-row-reverse gap-4 w-full">
              {bedTimes.slice(4, 6).map((time, index) => (
                <div
                  key={index}
                  className="text-lg flex justify-around font-bold items-center bg-dark-500 w-full md:w-1/2 p-2 rounded-lg"
                >
                  <span>{time}</span>{" "}
                  <span className="text-sm opacity-70">Suggested</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex flex-row-reverse gap-4 w-full">
                {bedTimes.slice(2, 4).map((time, index) => (
                  <div
                    key={index}
                    className="text-lg w-1/2 font-bold text-center bg-dark-500 p-2 rounded-lg"
                  >
                    {time}
                  </div>
                ))}
              </div>
              <div className="flex flex-row-reverse gap-4 w-full">
                {bedTimes.slice(0, 2).map((time, index) => (
                  <div
                    key={index}
                    className="text-lg w-1/2 font-bold text-center bg-dark-500 p-2 rounded-lg"
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-sm opacity-70 mb-6">
            If you wake up at one of these times, you'll rise in between
            90-minute sleep cycles. A good night's sleep consists of 5-6
            complete sleep cycles.
          </p>
          <Button onClick={() => setBedTimes([])}>Reset</Button>
        </div>
      )}
    </div>
  );
}
