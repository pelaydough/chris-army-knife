"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Course {
  id: string;
  courseName: string;
  grade: string;
  credits: number;
  semester: string;
  year: string;
  bcmp: boolean;
}

const gradePoints: { [key: string]: number } = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
  W: 0, // Withdrawn - doesn't count toward GPA
  NP: 0, // No Pass - doesn't count toward GPA
};

const gradeOptions = [
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
  "W",
  "NP",
];

export default function GPA() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    grade: "A",
    credits: 3,
    semester: "Fall",
    year: new Date().getFullYear().toString(),
    bcmp: false,
  });

  // Load courses from localStorage on component mount
  useEffect(() => {
    const savedCourses = localStorage.getItem("gpa-calculator-courses");
    if (savedCourses) {
      try {
        const parsedCourses = JSON.parse(savedCourses);
        setCourses(parsedCourses);
      } catch (error) {
        console.error("Error loading courses from localStorage:", error);
      }
    }
  }, []);

  // Save courses to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem("gpa-calculator-courses", JSON.stringify(courses));
  }, [courses]);

  const addCourse = () => {
    if (newCourse.courseName.trim() === "") return;

    const course: Course = {
      id: Date.now().toString(),
      courseName: newCourse.courseName,
      grade: newCourse.grade,
      credits: newCourse.credits,
      semester: newCourse.semester,
      year: newCourse.year,
      bcmp: newCourse.bcmp,
    };

    setCourses([...courses, course]);
    setNewCourse({
      courseName: "",
      grade: "A",
      credits: 3,
      semester: newCourse.semester,
      year: newCourse.year,
      bcmp: false,
    });
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const updateCourse = (
    id: string,
    field: keyof Course,
    value: string | number | boolean
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const calculateGPA = () => {
    const validCourses = courses.filter(
      (course) =>
        course.grade !== "W" && course.grade !== "NP" && course.credits > 0
    );

    if (validCourses.length === 0) return 0;

    const totalPoints = validCourses.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.credits,
      0
    );

    const totalCredits = validCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateCGPA = () => {
    const validCourses = courses.filter(
      (course) =>
        course.grade !== "W" &&
        course.grade !== "NP" &&
        course.credits > 0 &&
        !course.bcmp
    );

    if (validCourses.length === 0) return 0;

    const totalPoints = validCourses.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.credits,
      0
    );

    const totalCredits = validCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateSGPA = () => {
    const validCourses = courses.filter(
      (course) =>
        course.grade !== "W" &&
        course.grade !== "NP" &&
        course.credits > 0 &&
        course.bcmp
    );

    if (validCourses.length === 0) return 0;

    const totalPoints = validCourses.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.credits,
      0
    );

    const totalCredits = validCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const getTotalCredits = () => {
    return courses
      .filter((course) => course.grade !== "W" && course.grade !== "NP")
      .reduce((sum, course) => sum + course.credits, 0);
  };

  const getAttemptedCredits = () => {
    return courses.reduce((sum, course) => sum + course.credits, 0);
  };

  // Group courses by year and semester
  const groupedCourses = courses.reduce((acc, course) => {
    const key = `${course.year}-${course.semester}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(course);
    return acc;
  }, {} as { [key: string]: Course[] });

  const calculateTermGPA = (courses: Course[]) => {
    const validCourses = courses.filter(
      (course) =>
        course.grade !== "W" && course.grade !== "NP" && course.credits > 0
    );

    if (validCourses.length === 0) return 0;

    const totalPoints = validCourses.reduce(
      (sum, course) => sum + gradePoints[course.grade] * course.credits,
      0
    );

    const totalCredits = validCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateTermData = (groupedCourses: { [key: string]: Course[] }) => {
    return Object.entries(groupedCourses)
      .map(([term, courses]) => {
        const [year, semester] = term.split("-");

        // Calculate GPAs for this term
        const allGPA = calculateTermGPA(courses);

        const bcmpCourses = courses.filter((course) => course.bcmp);
        const nonBcmpCourses = courses.filter((course) => !course.bcmp);

        const sGPA = calculateTermGPA(bcmpCourses);
        const cGPA = calculateTermGPA(nonBcmpCourses);

        // Calculate credits
        const credits = courses.reduce(
          (sum, course) =>
            course.grade !== "W" && course.grade !== "NP"
              ? sum + course.credits
              : sum,
          0
        );

        return {
          term: `${semester} ${year}`,
          Cumulative: allGPA,
          Science: sGPA,
          "Non-Science": cGPA,
          Credits: credits,
        };
      })
      .sort((a, b) => {
        const [semA, yearA] = a.term.split(" ");
        const [semB, yearB] = b.term.split(" ");

        if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);

        const semesterOrder = {
          Spring: 1,
          Summer: 2,
          Fall: 3,
          Winter: 4,
        };

        return (
          (semesterOrder[semA as keyof typeof semesterOrder] || 0) -
          (semesterOrder[semB as keyof typeof semesterOrder] || 0)
        );
      });
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4 text-primary">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">GPA Calculator</h1>

        {/* GPA Summary */}
        <div className="bg-dark-700 border-dark-500 border rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-primary">
                Overall GPA
              </h3>
              <p className="text-3xl font-bold text-primary">
                {calculateGPA().toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-primary">
                cGPA (Non-BCMP)
              </h3>
              <p className="text-3xl font-bold text-primary">
                {calculateCGPA().toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-primary">
                sGPA (BCMP)
              </h3>
              <p className="text-3xl font-bold text-primary">
                {calculateSGPA().toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-primary">
                Total Credits
              </h3>
              <p className="text-3xl font-bold text-primary">
                {getTotalCredits()}
              </p>
            </div>
          </div>
        </div>

        {/* Add Course Form */}
        <div className="bg-dark-700 border-dark-500 border rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Add Course
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Course Name
              </label>
              <input
                type="text"
                value={newCourse.courseName}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, courseName: e.target.value })
                }
                placeholder="e.g., MATH 005A"
                className="w-full px-3 py-2 bg-dark-500 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Grade
              </label>
              <Select
                value={newCourse.grade}
                onValueChange={(value) =>
                  setNewCourse({ ...newCourse, grade: value })
                }
              >
                <SelectTrigger className="w-full bg-dark-500 border-none text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-500 text-primary">
                  {gradeOptions.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Credits
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={newCourse.credits}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    credits: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-dark-500 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Semester
              </label>
              <Select
                value={newCourse.semester}
                onValueChange={(value) =>
                  setNewCourse({ ...newCourse, semester: value })
                }
              >
                <SelectTrigger className="w-full bg-dark-500 border-none text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-500 text-primary">
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                  <SelectItem value="Winter">Winter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                Year
              </label>
              <input
                type="number"
                min="2000"
                max="2030"
                value={newCourse.year}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, year: e.target.value })
                }
                className="w-full px-3 py-2 bg-dark-500 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-primary mb-1">
                BCMP
              </label>
              <div className="flex items-center h-10">
                <Checkbox
                  checked={newCourse.bcmp}
                  onCheckedChange={(checked) =>
                    setNewCourse({ ...newCourse, bcmp: checked === true })
                  }
                />
              </div>
            </div>
          </div>
          <button
            onClick={addCourse}
            className="mt-4 bg-primary text-dark-900 px-6 py-2 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
          >
            Add Course
          </button>
        </div>

        {/* Add this before the Course List section */}
        {courses.length > 0 && (
          <div className="bg-dark-700 border-dark-500 border rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4">
              GPA Trends
            </h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer>
                <LineChart
                  data={calculateTermData(groupedCourses)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="term" stroke="#fff" tick={{ fill: "#fff" }} />
                  <YAxis
                    yAxisId="left"
                    domain={[0, 4]}
                    stroke="#fff"
                    tick={{ fill: "#fff" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 30]}
                    stroke="#fff"
                    tick={{ fill: "#fff" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Cumulative"
                    stroke="#2563eb"
                    dot={{ fill: "#2563eb" }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Science"
                    stroke="#eab308"
                    dot={{ fill: "#eab308" }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Non-Science"
                    stroke="#84cc16"
                    dot={{ fill: "#84cc16" }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="Credits"
                    stroke="#94a3b8"
                    dot={{ fill: "#94a3b8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Course List */}
        <div className="bg-dark-700 border-dark-500 border rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold text-primary p-6 border-b border-dark-500">
            Course History
          </h2>

          {courses.length === 0 ? (
            <div className="p-6 text-center text-primary/70">
              No courses added yet. Add your first course above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      BCMP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-700 divide-y divide-dark-500">
                  {Object.entries(groupedCourses)
                    .sort(([a], [b]) => {
                      const [yearA, semesterA] = a.split("-");
                      const [yearB, semesterB] = b.split("-");
                      if (yearA !== yearB)
                        return parseInt(yearB) - parseInt(yearA);
                      const semesterOrder = {
                        Spring: 1,
                        Summer: 2,
                        Fall: 3,
                        Winter: 4,
                      };
                      return (
                        (semesterOrder[
                          semesterB as keyof typeof semesterOrder
                        ] || 0) -
                        (semesterOrder[
                          semesterA as keyof typeof semesterOrder
                        ] || 0)
                      );
                    })
                    .map(([term, termCourses]) =>
                      termCourses.map((course, index) => (
                        <tr
                          key={course.id}
                          className={
                            index === 0 ? "border-t-2 border-primary/20" : ""
                          }
                        >
                          {index === 0 && (
                            <td
                              rowSpan={termCourses.length}
                              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary bg-dark-500"
                            >
                              {course.semester} {course.year}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={course.courseName}
                              onChange={(e) =>
                                updateCourse(
                                  course.id,
                                  "courseName",
                                  e.target.value
                                )
                              }
                              className="text-sm text-primary border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 bg-dark-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Select
                              value={course.grade}
                              onValueChange={(value) =>
                                updateCourse(course.id, "grade", value)
                              }
                            >
                              <SelectTrigger className="bg-dark-500 border-none text-primary">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-dark-500 text-primary">
                                {gradeOptions.map((grade) => (
                                  <SelectItem
                                    className="hover:bg-dark-900 cursor-pointer"
                                    key={grade}
                                    value={grade}
                                  >
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={course.credits}
                              onChange={(e) =>
                                updateCourse(
                                  course.id,
                                  "credits",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 text-sm text-primary bg-dark-500 border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Checkbox
                              checked={course.bcmp}
                              onCheckedChange={(checked) =>
                                updateCourse(
                                  course.id,
                                  "bcmp",
                                  checked === true
                                )
                              }
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                            {course.grade === "W" || course.grade === "NP"
                              ? "-"
                              : (
                                  gradePoints[course.grade] * course.credits
                                ).toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => deleteCourse(course.id)}
                              className="text-red-400 hover:text-red-300 focus:outline-none"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
