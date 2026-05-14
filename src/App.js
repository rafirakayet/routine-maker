import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import SaveIndicator from './components/SaveIndicator';
import React, { useEffect, useMemo, useState, useCallback } from "react";

import './App.css'; // Ensure CSS import for styling

// ---------------------------
// Constants & Seed Data
// ---------------------------

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const THEORY_SLOTS = [
  { id: "T1", label: "08:30 - 09:50", idx: 0, start: 510, end: 590 },
  { id: "T2", label: "10:00 - 11:20", idx: 1, start: 600, end: 680 },
  { id: "T3", label: "11:30 - 12:50", idx: 2, start: 690, end: 770 },
  { id: "T4", label: "13:30 - 14:50", idx: 3, start: 810, end: 890 },
  { id: "T5", label: "15:00 - 16:20", idx: 4, start: 900, end: 980 },
  { id: "T6", label: "16:30 - 17:50", idx: 5, start: 990, end: 1070 }
];

const LAB_SLOTS = [
  { id: "L1", label: "08:00 - 10:00", idx: 0, start: 480, end: 600 },
  { id: "L2", label: "10:00 - 12:00", idx: 1, start: 600, end: 720 },
  { id: "L3", label: "12:00 - 14:00", idx: 2, start: 720, end: 840 },
  { id: "L4", label: "14:00 - 16:00", idx: 3, start: 840, end: 960 },
  { id: "L5", label: "16:00 - 18:00", idx: 4, start: 960, end: 1080 }
];


const DEFAULT_THEORY_ROOMS = [
  { id: "O408", name: "Theory Room O408", type: "theory"},
  { id: "O410", name: "Theory Room O410", type: "theory"},
  { id: "O413", name: "Theory Room O413", type: "theory"},
  { id: "O415", name: "Theory Room O415", type: "theory"},
  { id: "O417", name: "Theory Room O417", type: "theory"},
  { id: "O422", name: "Theory Room O422", type: "theory"},
  { id: "O423", name: "Theory Room O423", type: "theory"},
  { id: "O424", name: "Theory Room O424", type: "theory"}
];
const DEFAULT_LAB_ROOMS = [
  { id: "O112", name: "Lab Room O112", type: "lab", allowedCourses: ["PHY122", "CHE122"] },
  { id: "O105", name: "Lab Room O105", type: "lab", allowedCourses: ["EEE416"] },
  { id: "O108", name: "Lab Room 0108", type: "lab", allowedCourses: ["EEE234", "EEE336",] },
  { id: "O201", name: "Lab Room O201", type: "lab", allowedCourses: ["EEE324"] },
  { id: "O211", name: "Lab Room O211", type: "lab", allowedCourses: ["EEE132", "EEE230","EEE414","EEE442"] },
  { id: "O503", name: "Lab Room O503", type: "lab", allowedCourses: ["EEE326", "EEE332","EEE320"] },
  { id: "O505", name: "Lab Room O505", type: "lab", allowedCourses: ["EEE334"] },
  { id: "O506", name: "Lab Room O506", type: "lab", allowedCourses: ["CEN220","EEE134","EEE314","EEE220"] }
];

const SEED_TEACHERS = [
  { id: "DMMH", name: "Prof. Dr. Md. Mofazzal Hossain", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MRA", name: "Prof. Dr. Md. Ruhul Amin", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MAA", name: "Dr. Nur Hosain Md. Ariful Azim", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "ABMS", name: "Dr. Abul Barkat Mollah Sayeed Ud Doulah", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "AH", name: "Dr. Md. Asif Hossain", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MMK", name: "Dr. Mahjabin Mobarak", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "HBG", name: "Dr. Habiba Begum", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MSHA", name: "Dr. Md. Shahjalal", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "AAMR", name: "Dr. Abdullah Al Mahfuzur Rahman", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "TAW", name: "Mr. Tawsif Hossain Chowdhury", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "FRL", name: "Ms. Farzana Alam", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "PJD", name: "Ms. Puja Das", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MRI", name: "Mr. Md. Rounakul Islam", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MZH", name: "Mr. Zahid Hasan", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MLM", name: "Mr. Limon Mollah", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MRT", name: "Ms. Ruchira Tabassum", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "SMP", name: "Mr. Sofi Mahmud Parvez", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "SLA", name: "Mr. Md. Shamsul Arefin", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MMA", name: "Mr. Mahfuzur Rahman Munna", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MAN", name: "Mr. Md. Manzurul Hasan", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "RR", name: "Mr. Rakayet Rafi", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "RASR", name: "Ms. Razia Sultana Rimu", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "AAC", name: "Mr. Atiqul Alam Chowdhury", type: "full", holidays: [5, 6], unavailable: [], preferred: [] },
  { id: "MHHN", name: "Mr. Md. Hasebul Hasan Niloy", type: "full", holidays: [5, 6], unavailable: [], preferred: [] }
];
const SEED_BATCHES = [ 
  { id: "Batch50", name: "Batch50", sections: ["A", "B", "C", "D"] }, 
  { id: "Batch49", name: "Batch49", sections: ["A", "B"] },
  { id: "Batch48", name: "Batch48", sections: ["A", "B","C", "D"] }, 
  { id: "Batch47", name: "Batch47", sections: ["A", "B", "C"] }, 
  { id: "Batch46", name: "Batch46", sections: ["A", "B", "C"] }, 
  { id: "Batch45", name: "Batch45", sections: ["A","B"] }, 
  { id: "Batch44", name: "Batch44", sections: ["A","B","C"] }, 
  { id: "Batch43", name: "Batch43", sections: ["A"] }, 
  { id: "Batch42", name: "Batch42", sections: ["A","B"] }, 
  { id: "Batch41", name: "Batch41", sections: ["A","B"] }, 
  { id: "Batch40", name: "Batch40", sections: ["A"] }, 
  { id: "Batch39", name: "Batch39", sections: ["A"] }, ];
const SEED_COURSES = [
  {id:"EEE111",code:"EEE111",title:"Electrical Circuit I",type:"theory",sections:[{batch:"Batch50",section:"A",teacher:"MRA"},{batch:"Batch50",section:"B",teacher:"MRA"},{batch:"Batch50",section:"C",teacher:"MRA"},{batch:"Batch50",section:"D",teacher:"ABMS"}]},
  {id:"ENG101",code:"ENG101",title:"Basic English Skills",type:"theory",sections:[{batch:"Batch50",section:"A",teacher:"TBD"},{batch:"Batch50",section:"B",teacher:"TBD"},{batch:"Batch50",section:"C",teacher:"TBD"},{batch:"Batch50",section:"D",teacher:"TBD"}]},
  {id:"MAT111",code:"MAT111",title:"Mathematics I (Differential and Integral Calculus)",type:"theory",sections:[{batch:"Batch50",section:"A",teacher:"MAA"},{batch:"Batch50",section:"B",teacher:"MAA"},{batch:"Batch50",section:"C",teacher:"MAA"},{batch:"Batch50",section:"D",teacher:"MAA"}]},
  {id:"PHY115",code:"PHY115",title:"Physics I (Electricity and Magnetism, Thermodynamics and Mechanics)",type:"theory",sections:[{batch:"Batch50",section:"A",teacher:"MMK"},{batch:"Batch50",section:"B",teacher:"MMK"},{batch:"Batch50",section:"C",teacher:"TBD"},{batch:"Batch50",section:"D",teacher:"TBD"}]},
  {id:"ENG102",code:"ENG102",title:"Intermediate English Skills",type:"theory",sections:[{batch:"Batch49",section:"A",teacher:"TBD"},{batch:"Batch49",section:"B",teacher:"TBD"},{batch:"Batch49",section:"C",teacher:"TBD"},{batch:"Batch49",section:"D",teacher:"TBD"}]},
  {id:"MAT125",code:"MAT125",title:"Mathematics II (Ordinary and Partial Differential Equations)",type:"theory",sections:[{batch:"Batch49",section:"A",teacher:"SMP"},{batch:"Batch49",section:"B",teacher:"SMP"},{batch:"Batch49",section:"C",teacher:"SMP"},{batch:"Batch49",section:"D",teacher:"SMP"}]},
  {id:"PHY121",code:"PHY121",title:"Physics II (Waves and Oscillations, Optics and Modern Physics)",type:"theory",sections:[{batch:"Batch49",section:"A",teacher:"MHHN"},{batch:"Batch49",section:"B",teacher:"MHHN"},{batch:"Batch49",section:"C",teacher:"MHHN"},{batch:"Batch49",section:"D",teacher:"MHHN"}]},
  {id:"PHY122",code:"PHY122",title:"Physics Laboratory",type:"lab",sections:[{batch:"Batch49",section:"A",teacher:"MHHN"},{batch:"Batch49",section:"B",teacher:"MHHN"},{batch:"Batch49",section:"C",teacher:"MHHN"},{batch:"Batch49",section:"D",teacher:"TBD"}]},
  {id:"CHE121",code:"CHE121",title:"Engineering Chemistry",type:"theory",sections:[{batch:"Batch49",section:"A",teacher:"TBD"},{batch:"Batch49",section:"B",teacher:"TBD"},{batch:"Batch49",section:"C",teacher:"TBD"},{batch:"Batch49",section:"D",teacher:"TBD"}]},
  {id:"CHE122",code:"CHE122",title:"Engineering Chemistry Laboratory",type:"lab",sections:[{batch:"Batch49",section:"A",teacher:"TBD"},{batch:"Batch49",section:"B",teacher:"TBD"},{batch:"Batch49",section:"C",teacher:"TBD"},{batch:"Batch49",section:"D",teacher:"TBD"}]},
  {id:"ENG103",code:"ENG103",title:"Advanced English Skills",type:"theory",sections:[{batch:"Batch48",section:"A",teacher:"TBD"},{batch:"Batch48",section:"B",teacher:"TBD"}]},
  {id:"EEE131",code:"EEE131",title:"Electrical Circuits II",type:"theory",sections:[{batch:"Batch48",section:"A",teacher:"MMK"},{batch:"Batch48",section:"B",teacher:"MMK"}]},
  {id:"EEE132",code:"EEE132",title:"Electrical Circuit Laboratory",type:"lab",sections:[{batch:"Batch48",section:"A",teacher:"HBG"},{batch:"Batch48",section:"B",teacher:"MRI"}]},
  {id:"MAT135",code:"MAT135",title:"Mathematics III (Complex Variables, Fourier Series and Transforms)",type:"theory",sections:[{batch:"Batch48",section:"A",teacher:"TBD"},{batch:"Batch48",section:"B",teacher:"TBD"}]},
  {id:"EEE133",code:"EEE133",title:"Computer Programming",type:"theory",sections:[{batch:"Batch48",section:"A",teacher:"AH"},{batch:"Batch48",section:"B",teacher:"AH"}]},
  {id:"EEE134",code:"EEE134",title:"Computer Programming Laboratory",type:"lab",sections:[{batch:"Batch48",section:"A",teacher:"AH"},{batch:"Batch48",section:"B",teacher:"AH"}]},
  {id:"ENG105",code:"ENG105",title:"Public Speaking",type:"theory",sections:[{batch:"Batch47",section:"A",teacher:"TBD"},{batch:"Batch47",section:"B",teacher:"TBD"},{batch:"Batch47",section:"C",teacher:"TBD"}]},
  {id:"EEE215",code:"EEE215",title:"Electronics I",type:"theory",sections:[{batch:"Batch47",section:"A",teacher:"HBG"},{batch:"Batch47",section:"B",teacher:"HBG"},{batch:"Batch47",section:"C",teacher:"HBG"}]},
  {id:"SOC215",code:"SOC215",title:"Engineering Ethics",type:"theory",sections:[{batch:"Batch47",section:"A",teacher:"AAC"},{batch:"Batch47",section:"B",teacher:"AAC"},{batch:"Batch47",section:"C",teacher:"AAC"}]},
  {id:"MAT217",code:"MAT217",title:"Mathematics IV (Linear Algebra, Co-ordinate Geometry and Vector Analysis)",type:"theory",sections:[{batch:"Batch47",section:"A",teacher:"TBD"},{batch:"Batch47",section:"B",teacher:"TBD"},{batch:"Batch47",section:"C",teacher:"TBD"}]},
  {id:"MEN211",code:"MEN211",title:"Mechanical Engineering Fundamentals",type:"theory",sections:[{batch:"Batch47",section:"A",teacher:"RASR"},{batch:"Batch47",section:"B",teacher:"RASR"},{batch:"Batch47",section:"C",teacher:"RASR"}]},
  {id:"CEN220",code:"CEN220",title:"Civil Engineering Drawing",type:"lab",sections:[{batch:"Batch46",section:"A",teacher:"RASR"},{batch:"Batch46",section:"B",teacher:"RASR"},{batch:"Batch46",section:"C",teacher:"RASR"}]},
  {id:"EEE220",code:"EEE220",title:"Electrical and Electronic Circuit Simulation Laboratory",type:"lab",sections:[{batch:"Batch46",section:"A",teacher:"FRL"},{batch:"Batch46",section:"B",teacher:"PJD"},{batch:"Batch46",section:"C",teacher:"PJD"}]},
  {id:"EEE225",code:"EEE225",title:"Electronics II",type:"theory",sections:[{batch:"Batch46",section:"A",teacher:"MSHA"},{batch:"Batch46",section:"B",teacher:"MSHA"},{batch:"Batch46",section:"C",teacher:"MSHA"}]},
  {id:"EEE223",code:"EEE223",title:"Energy Conversion I",type:"theory",sections:[{batch:"Batch46",section:"A",teacher:"TAW"},{batch:"Batch46",section:"B",teacher:"TAW"},{batch:"Batch46",section:"C",teacher:"FRL"}]},
  {id:"EEE227",code:"EEE227",title:"Engineering Electromagnetics",type:"theory",sections:[{batch:"Batch46",section:"A",teacher:"MMA"},{batch:"Batch46",section:"B",teacher:"MMA"},{batch:"Batch46",section:"C",teacher:"MMA"}]},
  {id:"MAT229",code:"MAT229",title:"Mathematics V (Probability and Statistics)",type:"theory",sections:[{batch:"Batch45",section:"A",teacher:"MAA"}]},
  {id:"EEE230",code:"EEE230",title:"Electronics Laboratory",type:"lab",sections:[{batch:"Batch45",section:"A",teacher:"HBG"},{batch:"Batch45",section:"B",teacher:"HBG"}]},
  {id:"EEE231",code:"EEE231",title:"Properties of Materials",type:"theory",sections:[{batch:"Batch45",section:"A",teacher:"MZH"}]},
  {id:"EEE233",code:"EEE233",title:"Energy Conversion II",type:"theory",sections:[{batch:"Batch45",section:"A",teacher:"AAMR"}]},
  {id:"EEE234",code:"EEE234",title:"Energy Conversion Laboratory",type:"lab",sections:[{batch:"Batch45",section:"A",teacher:"AAMR"},{batch:"Batch45",section:"B",teacher:"AAMR"}]},
  {id:"EEE237",code:"EEE237",title:"Continuous Signals and Linear Systems",type:"theory",sections:[{batch:"Batch45",section:"A",teacher:"ABMS"}]},
  {id:"MGT231",code:"MGT231",title:"Industrial Management",type:"theory",sections:[{batch:"Batch45",section:"A",teacher:"AH"}]},
  {id:"EEE301",code:"EEE301",title:"Robotics and Automation",type:"theory",sections:[{batch:"Batch44",section:"A",teacher:"RR"},{batch:"Batch44",section:"B",teacher:"RR"}]},
  {id:"EEE313",code:"EEE313",title:"Numerical Techniques",type:"theory",sections:[{batch:"Batch44",section:"A",teacher:"SLA"},{batch:"Batch44",section:"B",teacher:"SLA"},{batch:"Batch44",section:"C",teacher:"TBD"}]},
  {id:"EEE314",code:"EEE314",title:"Numerical Techniques Laboratory",type:"lab",sections:[{batch:"Batch44",section:"A",teacher:"SLA"},{batch:"Batch44",section:"B",teacher:"SLA"}]},
  {id:"EEE317",code:"EEE317",title:"Power Systems I",type:"theory",sections:[{batch:"Batch44",section:"A",teacher:"DMMH"},{batch:"Batch44",section:"B",teacher:"AAMR"},{batch:"Batch44",section:"C",teacher:"AAMR"}]},
  {id:"ECO315",code:"ECO315",title:"Engineering Economics",type:"theory",sections:[{batch:"Batch44",section:"A",teacher:"TBD"},{batch:"Batch44",section:"B",teacher:"TBD"}]},
  {id:"EEE320",code:"EEE320",title:"Electrical Service Design",type:"lab",sections:[{batch:"Batch43",section:"A",teacher:"RR"},{batch:"Batch43",section:"B",teacher:"RR"}]},
  {id:"EEE321",code:"EEE321",title:"Solid State Devices",type:"theory",sections:[{batch:"Batch43",section:"A",teacher:"MRI"},{batch:"Batch43",section:"B",teacher:"MRI"}]},
  {id:"EEE323",code:"EEE323",title:"Digital Electronics",type:"theory",sections:[{batch:"Batch43",section:"A",teacher:"ABMS"}]},
  {id:"EEE324",code:"EEE324",title:"Digital Electronics Laboratory",type:"lab",sections:[{batch:"Batch43",section:"A",teacher:"FRL"}]},
  {id:"EEE325",code:"EEE325",title:"Digital Signal Processing I",type:"theory",sections:[{batch:"Batch43",section:"B",teacher:"TBA"}]},
  {id:"EEE326",code:"EEE326",title:"Digital Signal Processing I Laboratory",type:"lab",sections:[{batch:"Batch43",section:"B",teacher:"AH"}]},
  {id:"EEE331",code:"EEE331",title:"Microprocessor and Interfacing",type:"theory",sections:[{batch:"Batch42",section:"A",teacher:"MRT"}]},
  {id:"EEE332",code:"EEE332",title:"Microprocessor and Interfacing Laboratory",type:"lab",sections:[{batch:"Batch42",section:"A",teacher:"MRT"}]},
   {id:"EEE335",code:"EEE335",title:"Control Systems",type:"theory",sections:[{batch:"Batch42",section:"A",teacher:"AAMR"}]},
  {id:"EEE336",code:"EEE336",title:"Control Systems Laboratory",type:"lab",sections:[{batch:"Batch42",section:"A",teacher:"AAMR"}]},
  {id:"EEE339",code:"EEE339",title:"Electrical Power Transmission and Distribution",type:"theory",sections:[{batch:"Batch42",section:"A",teacher:"MLM"}]},
  {id:"EEE401",code:"EEE401",title:"VLSI I",type:"theory",sections:[{batch:"Batch41",section:"A",teacher:"MAN"}]},
  {id:"EEE413",code:"EEE413",title:"Power Electronics",type:"theory",sections:[{batch:"Batch41",section:"A",teacher:"MZH"}]},
  {id:"EEE414",code:"EEE414",title:"Power Electronics Laboratory",type:"lab",sections:[{batch:"Batch41",section:"A",teacher:"MZH"}]},
  {id:"EEE410",code:"EEE410",title:"Green Power and Energy",type:"theory",sections:[{batch:"Batch41",section:"A",teacher:"PJD"}]},
  {id:"EEE431",code:"EEE431",title:"Green Electronics",type:"theory",sections:[{batch:"Batch40",section:"A",teacher:"TBD"}]},
  {id:"EEE433",code:"EEE433",title:"VLSI II",type:"theory",sections:[{batch:"Batch40",section:"A",teacher:"TBD"}]},
  {id:"EEE411",code:"EEE411",title:"Power Systems II",type:"theory",sections:[{batch:"Batch40",section:"A",teacher:"TBD"}]},
  {id:"EEE303",code:"EEE303",title:"Biomedical Engineering",type:"theory",sections:[{batch:"Batch44",section:"C",teacher:"TBD"}]},

];
const MAX_CLASSES_PER_DAY = 3;

// ---------------------------
// Utilities
// ---------------------------
function uid(prefix = "id") { return `${prefix}_${Math.random().toString(36).slice(2, 9)}`; }
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
function slotKey(type, day, slotId) { return `${type}_${day}_${slotId}`; }

function hasTimeOverlap(type1, slotId1, type2, slotId2) {
  const slots1 = type1 === 'theory' ? THEORY_SLOTS : LAB_SLOTS;
  const slots2 = type2 === 'theory' ? THEORY_SLOTS : LAB_SLOTS;
  const s1 = slots1.find(s => s.id === slotId1);
  const s2 = slots2.find(s => s.id === slotId2);
  if (!s1 || !s2) return false;
  return Math.max(s1.start, s2.start) < Math.min(s1.end, s2.end);
}

// ---------------------------
// App
// ---------------------------
export default function App() {
  const [teachers, setTeachers] = useState(() => clone(SEED_TEACHERS));
  const [batches, setBatches] = useState(() => clone(SEED_BATCHES));
  const [theoryRooms, setTheoryRooms] = useState(() => clone(DEFAULT_THEORY_ROOMS));
  const [labRooms, setLabRooms] = useState(() => clone(DEFAULT_LAB_ROOMS));
  const [courses, setCourses] = useState(() => clone(SEED_COURSES));
  const [assignments, setAssignments] = useState([]);
  const [conflicts, setConflicts] = useState([]);

  const [activeTab, setActiveTab] = useState("data");
  const [selectedBatch, setSelectedBatch] = useState(batches?.[0]?.id ?? null);
  const [selectedSection, setSelectedSection] = useState(batches?.[0]?.sections?.[0] ?? null);
  const [selectedTeacher, setSelectedTeacher] = useState(teachers?.[0]?.id ?? null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [shiftingAssignment, setShiftingAssignment] = useState(null);

  const { user, sessionToken, signout, saveUserData, loadUserData, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const loadAllUserData = useCallback(async () => {
  if (!user || !sessionToken || isDataLoaded) return;
  
  const savedTeachers = await loadUserData('teachers');
  if (savedTeachers) setTeachers(savedTeachers);
  
  const savedBatches = await loadUserData('batches');
  if (savedBatches) setBatches(savedBatches);
  
  const savedTheoryRooms = await loadUserData('theoryRooms');
  if (savedTheoryRooms) setTheoryRooms(savedTheoryRooms);
  
  const savedLabRooms = await loadUserData('labRooms');
  if (savedLabRooms) setLabRooms(savedLabRooms);
  
  const savedCourses = await loadUserData('courses');
  if (savedCourses) setCourses(savedCourses);
  
  const savedAssignments = await loadUserData('assignments');
  if (savedAssignments) setAssignments(savedAssignments);
  
  setIsDataLoaded(true);
}, [user, sessionToken, isDataLoaded, loadUserData]);
  // Load SheetJS library dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.async = true;
    script.onload = () => console.log('SheetJS loaded');
    script.onerror = () => console.error('Failed to load SheetJS');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // localStorage persistence
  useEffect(() => {
    const key = "eee_routine_final_v1";
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teachers) setTeachers(parsed.teachers);
        if (parsed.batches) setBatches(parsed.batches);
        if (parsed.theoryRooms) setTheoryRooms(parsed.theoryRooms);
        if (parsed.labRooms) setLabRooms(parsed.labRooms);
        if (parsed.courses) setCourses(parsed.courses);
        if (parsed.assignments) setAssignments(parsed.assignments || []);
      } catch (e) {
        console.warn('Failed to load saved data', e);
      }
    }
  }, []);
  // Load data when user logs in or switches accounts
// Load data when user logs in or switches accounts
useEffect(() => {
  if (user && sessionToken && !isDataLoaded) {
    loadAllUserData();
  }
}, [user, sessionToken, isDataLoaded, loadAllUserData]);
  useEffect(() => {
    const key = "eee_routine_final_v1";
    localStorage.setItem(key, JSON.stringify({ teachers, batches, theoryRooms, labRooms, courses, assignments }));
  }, [teachers, batches, theoryRooms, labRooms, courses, assignments]);

  const teachersById = useMemo(() => Object.fromEntries(teachers.map(t => [t.id, t])), [teachers]);
  const roomsById = useMemo(() => Object.fromEntries([...theoryRooms, ...labRooms].map(r => [r.id, r])), [theoryRooms, labRooms]);

  // Conflict check helpers excluding a specific assignment
  function teacherHasConflictExcluding(tid, type, day, slotId, excludeId) {
    return assignments.some(a => a.id !== excludeId && a.teacher === tid && a.type === type && a.day === day && a.slotId === slotId);
  }

  function studentHasConflictExcluding(batch, section, type, day, slotId, excludeId) {
    return assignments.some(a => a.id !== excludeId && a.batch === batch && a.section === section && a.type === type && a.day === day && a.slotId === slotId);
  }

  function studentDailyCountExcluding(batch, section, day, excludeId) {
    return assignments.filter(a => a.id !== excludeId && a.batch === batch && a.section === section && a.day === day).length;
  }

  function teacherDailyCountExcluding(tid, day, excludeId) {
    return assignments.filter(a => a.id !== excludeId && a.teacher === tid && a.day === day).length;
  }

  function causesLongGapExcluding(batch, section, type, day, slotIdx, excludeId) {
    const existing = assignments.filter(a => a.id !== excludeId && a.batch === batch && a.section === section && a.type === type && a.day === day);
    const source = type === 'theory' ? THEORY_SLOTS : LAB_SLOTS;
    const allIdxs = existing.map(a => source.find(s => s.id === a.slotId)?.idx || -1).filter(x => x >= 0);
    allIdxs.push(slotIdx);
    if (allIdxs.length <= 1) return false;
    const minIdx = Math.min(...allIdxs);
    const maxIdx = Math.max(...allIdxs);
    const gap = maxIdx - minIdx;
    return gap >= 3; // max 2 slots gap
  }

  function teacherCausesLongGapExcluding(tid, type, day, slotIdx, excludeId) {
    const existing = assignments.filter(a => a.id !== excludeId && a.teacher === tid && a.type === type && a.day === day);
    const source = type === 'theory' ? THEORY_SLOTS : LAB_SLOTS;
    const allIdxs = existing.map(a => source.find(s => s.id === a.slotId)?.idx || -1).filter(x => x >= 0);
    allIdxs.push(slotIdx);
    if (allIdxs.length <= 1) return false;
    const minIdx = Math.min(...allIdxs);
    const maxIdx = Math.max(...allIdxs);
    const gap = maxIdx - minIdx;
    return gap >= 3; // max 2 slots gap
  }

  function studentHasOverlapWithOtherTypeExcluding(batch, section, proposedType, day, proposedSlotId, excludeId) {
    const otherType = proposedType === 'theory' ? 'lab' : 'theory';
    const allOther = assignments.filter(a => a.id !== excludeId && a.batch === batch && a.section === section && a.type === otherType && a.day === day);
    for (const a of allOther) {
      if (hasTimeOverlap(proposedType, proposedSlotId, otherType, a.slotId)) return true;
    }
    return false;
  }

  function teacherHasOverlapWithOtherTypeExcluding(tid, proposedType, day, proposedSlotId, excludeId) {
    const otherType = proposedType === 'theory' ? 'lab' : 'theory';
    const allOther = assignments.filter(a => a.id !== excludeId && a.teacher === tid && a.type === otherType && a.day === day);
    for (const a of allOther) {
      if (hasTimeOverlap(proposedType, proposedSlotId, otherType, a.slotId)) return true;
    }
    return false;
  }
  
    // Auto-save to cloud when data changes
 useEffect(() => {
  if (!user || !sessionToken || !isDataLoaded) return;
  
  const saveTimeout = setTimeout(() => {
    saveUserData('teachers', teachers);
    saveUserData('batches', batches);
    saveUserData('theoryRooms', theoryRooms);
    saveUserData('labRooms', labRooms);
    saveUserData('courses', courses);
    saveUserData('assignments', assignments);
  }, 2000);
  
  return () => clearTimeout(saveTimeout);
}, [teachers, batches, theoryRooms, labRooms, courses, assignments]);
// ---------------------------
  // Generator (Greedy heuristic)
  // ---------------------------
  function generateRoutine(fullRegen = false, switchToView = false) {
  let newAssignments = [];
  const newConflicts = [];
  
  if (!fullRegen) {
    // For update mode: ONLY keep assignments that still have matching course sections
    const currentInstanceKeys = new Set();
    
    courses.forEach(course => {
      course.sections.forEach(sec => {
        const key = `${course.id}_${sec.batch}_${sec.section}`;
        currentInstanceKeys.add(key);
      });
    });
    
    // Filter assignments - only keep those that still exist in current courses
    newAssignments = assignments.filter(a => {
      const key = `${a.courseId}_${a.batch}_${a.section}`;
      return currentInstanceKeys.has(key);
    });
    
    // Also update teacher in existing assignments if it changed in the course
    newAssignments = newAssignments.map(a => {
      const course = courses.find(c => c.id === a.courseId);
      if (course) {
        const section = course.sections.find(s => s.batch === a.batch && s.section === a.section);
        if (section && section.teacher !== a.teacher) {
          // Teacher changed - mark for regeneration
          return null;
        }
      }
      return a;
    }).filter(a => a !== null);
  }

  // Build schedules from current assignments
  const studentSchedule = {};
  const teacherSchedule = {};
  const roomSchedule = {};

  function ensureStudent(batch, section) { 
    const key = `${batch}_${section}`; 
    if (!studentSchedule[key]) studentSchedule[key] = { theory: Array(7).fill(null).map(() => []), lab: Array(7).fill(null).map(() => []) }; 
    return studentSchedule[key]; 
  }
  function ensureTeacherSched(tid) { 
    if (!teacherSchedule[tid]) teacherSchedule[tid] = { theory: Array(7).fill(null).map(() => ({})), lab: Array(7).fill(null).map(() => ({})) }; 
    return teacherSchedule[tid]; 
  }
  function ensureRoomSched(rid) { 
    if (!roomSchedule[rid]) roomSchedule[rid] = { theory: Array(7).fill(null).map(() => ({})), lab: Array(7).fill(null).map(() => ({})) }; 
    return roomSchedule[rid]; 
  }

  newAssignments.forEach(a => {
    ensureStudent(a.batch, a.section)[a.type][a.day].push(a.slotId);
    if (a.teacher) {
      ensureTeacherSched(a.teacher);
      teacherSchedule[a.teacher][a.type][a.day][a.slotId] = a.instanceId;
    }
    ensureRoomSched(a.roomId);
    roomSchedule[a.roomId][a.type][a.day][a.slotId] = a.instanceId;
  });

  // Build instances from courses' sections
  const instances = [];
  courses.forEach(course => {
    const requiredSlots = course.type === 'theory' ? 2 : 1;
    course.sections.forEach(sec => {
      instances.push({ courseId: course.id, code: course.code, title: course.title, type: course.type, teacher: sec.teacher, batch: sec.batch, section: sec.section, requiredSlots });
    });
  });

  // Sort instances to place labs/theory with more restrictions first
  instances.sort((a, b) => b.requiredSlots - a.requiredSlots || a.code.localeCompare(b.code));

  function studentHasConflict(batch, section, type, day, slotId) { const s = studentSchedule[`${batch}_${section}`]; return s ? s[type][day].some(a => a === slotId) : false; }
  function studentDailyCount(batch, section, day) { const s = studentSchedule[`${batch}_${section}`]; return s ? s.theory[day].length + s.lab[day].length : 0; }
  function teacherHasConflict(tid, type, day, slotId) { const t = teacherSchedule[tid]; return t ? !!t[type][day][slotId] : false; }
  function teacherDailyCount(tid, day) { const t = teacherSchedule[tid]; return t ? Object.keys(t.theory[day]).length + Object.keys(t.lab[day]).length : 0; }
  function roomHasConflict(rid, type, day, slotId) { const r = roomSchedule[rid]; return r ? !!r[type][day][slotId] : false; }
  function computeTeacherDaysCount(tid) { const t = teacherSchedule[tid]; if (!t) return 0; const days = new Set(); for (let d = 0; d < 7; d++) { if (Object.keys(t.theory[d]).length > 0 || Object.keys(t.lab[d]).length > 0) days.add(d); } return days.size; }
  function causesLongGap(batch, section, type, day, slotIdx) { 
    const s = studentSchedule[`${batch}_${section}`]; 
    if (!s) return false;
    const arr = s[type][day].map(id => { const source = type === 'theory' ? THEORY_SLOTS : LAB_SLOTS; const found = source.find(x => x.id === id); return found ? found.idx : -1; }); 
    const all = arr.concat([slotIdx]).filter(x => x >= 0); 
    if (all.length <= 1) return false; 
    const minIdx = Math.min(...all); 
    const maxIdx = Math.max(...all); 
    const gap = Math.abs(maxIdx - minIdx); 
    return gap >= 3; 
  }
  function teacherCausesLongGap(tid, type, day, slotIdx) { 
    const t = teacherSchedule[tid]; 
    if (!t) return false;
    const arr = Object.keys(t[type][day]).map(id => { const source = type === 'theory' ? THEORY_SLOTS : LAB_SLOTS; const found = source.find(x => x.id === id); return found ? found.idx : -1; }); 
    const all = arr.concat([slotIdx]).filter(x => x >= 0); 
    if (all.length <= 1) return false; 
    const minIdx = Math.min(...all); 
    const maxIdx = Math.max(...all); 
    const gap = Math.abs(maxIdx - minIdx); 
    return gap >= 3; 
  }

  function studentHasOverlapWithOtherType(batch, section, proposedType, day, proposedSlotId) {
    const otherType = proposedType === 'theory' ? 'lab' : 'theory';
    const s = studentSchedule[`${batch}_${section}`];
    if (!s) return false;
    const existingSlots = s[otherType][day];
    for (const existSlotId of existingSlots) {
      if (hasTimeOverlap(proposedType, proposedSlotId, otherType, existSlotId)) return true;
    }
    return false;
  }

  function teacherHasOverlapWithOtherType(tid, proposedType, day, proposedSlotId) {
    const otherType = proposedType === 'theory' ? 'lab' : 'theory';
    const t = teacherSchedule[tid];
    if (!t) return false;
    const existing = Object.keys(t[otherType][day]);
    for (const existSlotId of existing) {
      if (hasTimeOverlap(proposedType, proposedSlotId, otherType, existSlotId)) return true;
    }
    return false;
  }

  // attempt to place each instance
  for (const inst of instances) {
    const teacher = inst.teacher ? teachersById[inst.teacher] : null;
    if (!teacher && inst.teacher !== null && inst.teacher !== 'TBD' && inst.teacher !== 'TBA') { 
      newConflicts.push({ inst, reason: 'No teacher assigned' }); 
      continue; 
    }
    
    const existingForInst = newAssignments.filter(a => a.courseId === inst.courseId && a.batch === inst.batch && a.section === inst.section);
    const placedCount = existingForInst.length;
    if (placedCount >= inst.requiredSlots) continue;
    const needed = inst.requiredSlots - placedCount;
    const instanceId = placedCount > 0 ? existingForInst[0].instanceId : uid('inst');
    const slotsSource = inst.type === 'theory' ? THEORY_SLOTS : LAB_SLOTS;
    const roomsSource = inst.type === 'theory' ? theoryRooms : labRooms;

    const preferRoomIds = roomsSource.filter(r => r.type === inst.type && (!r.allowedCourses || r.allowedCourses.length === 0 || r.allowedCourses.includes(inst.courseId))).map(r => r.id);
    const candidateRooms = preferRoomIds.length ? preferRoomIds : roomsSource.map(r => r.id);

    let placed = 0;
    let placedDays = new Set(existingForInst.map(a => a.day));
    for (let i = 0; i < needed; i++) {
      let best = null;
      let prevDay = null;
      let prevSlotId = null;
      if (placed > 0 || existingForInst.length > 0) {
        const prevAss = newAssignments.filter(a => a.instanceId === instanceId);
        if (prevAss[0]) {
          prevDay = prevAss[0].day;
          prevSlotId = prevAss[0].slotId;
        }
      }

      for (let day = 0; day < 7; day++) {
        if (teacher && teacher.holidays.includes(day)) continue;
        if (inst.type === 'theory' && placedDays.has(day)) continue;

        for (const slot of slotsSource) {
          const slotId = slot.id;
          const tUnavailable = teacher ? (teacher.unavailable || []) : [];
          if (teacher && tUnavailable.includes(slotKey(inst.type, day, slotId))) continue;
          if (teacher && teacherHasConflict(teacher.id, inst.type, day, slotId)) continue;
          if (studentHasConflict(inst.batch, inst.section, inst.type, day, slotId)) continue;
          if (studentHasOverlapWithOtherType(inst.batch, inst.section, inst.type, day, slotId)) continue;
          if (teacher && teacherHasOverlapWithOtherType(teacher.id, inst.type, day, slotId)) continue;

          for (const roomId of candidateRooms) {
            if (roomHasConflict(roomId, inst.type, day, slotId)) continue;
            if (studentDailyCount(inst.batch, inst.section, day) >= MAX_CLASSES_PER_DAY) continue;
            if (teacher && teacherDailyCount(teacher.id, day) >= MAX_CLASSES_PER_DAY) continue;

            let score = 0;
            const tPreferred = teacher ? (teacher.preferred || []) : [];
            if (teacher && tPreferred.includes(slotKey(inst.type, day, slotId))) score -= 10;

            const teacherDaysBefore = teacher ? computeTeacherDaysCount(teacher.id) : 0;
            const doesAddDay = teacher ? (() => { const tSched = teacherSchedule[teacher.id]; if (!tSched) return true; const hasOnThisDay = (Object.keys(tSched.theory[day]).length > 0) || (Object.keys(tSched.lab[day]).length > 0); return !hasOnThisDay; })() : false;
            if (teacher && doesAddDay && teacherDaysBefore >= 4) score += 50;

            if (causesLongGap(inst.batch, inst.section, inst.type, day, slot.idx)) score += 40;
            if (teacher && teacherCausesLongGap(teacher.id, inst.type, day, slot.idx)) score += 40;

            if (prevSlotId && slotId === prevSlotId) score -= 20;
            if (prevDay !== null) {
              const diff = Math.abs(day - prevDay);
              if (diff === 2) score -= 15;
              else if (diff === 1 || diff === 3) score -= 5;
            }

            score += Math.random() * 0.5;
            
            const candidate = { day, slotId, slotIdx: slot.idx, roomId, score };
            if (!best || candidate.score < best.score) best = candidate;
          }
        }
      }

      if (!best) { 
        newConflicts.push({ inst, reason: `Could not find slot #${placedCount + i + 1}` }); 
        break; 
      }

      // commit
      if (teacher) {
        ensureTeacherSched(teacher.id);
        teacherSchedule[teacher.id][inst.type][best.day][best.slotId] = instanceId;
      }
      ensureRoomSched(best.roomId);
      roomSchedule[best.roomId][inst.type][best.day][best.slotId] = instanceId;
      ensureStudent(inst.batch, inst.section)[inst.type][best.day].push(best.slotId);

      newAssignments.push({ 
        id: uid('a'), 
        instanceId, 
        courseId: inst.courseId, 
        code: inst.code, 
        title: inst.title, 
        type: inst.type, 
        batch: inst.batch, 
        section: inst.section, 
        teacher: inst.teacher, 
        day: best.day, 
        dayName: DAYS[best.day], 
        slotId: best.slotId, 
        slotLabel: (inst.type === 'theory' ? THEORY_SLOTS.find(s => s.id === best.slotId).label : LAB_SLOTS.find(s => s.id === best.slotId).label), 
        roomId: best.roomId 
      });
      placed++;
      placedDays.add(best.day);
    }
  }

  setAssignments(newAssignments);
  setConflicts(newConflicts);
  if (switchToView) {
    setActiveTab('view');
  }
  return { newAssignments, newConflicts };
}

  // ---------------------------
  // Data CRUD
  // ---------------------------
  function addTeacher(t) { setTeachers(prev => [...prev, { id: t.id || uid('T'), ...t }]); }
  function updateTeacher(id, patch) { setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t)); }
  function removeTeacher(id) { if (window.confirm('Remove teacher and unassign from courses')) { setTeachers(prev => prev.filter(t => t.id !== id)); setCourses(prev => prev.map(c => ({ ...c, sections: c.sections.map(s => s.teacher === id ? { ...s, teacher: null } : s) }))); } }

  function addCourse(c) { setCourses(prev => [...prev, { id: c.id || c.code || uid('C'), ...c }]); }
  function updateCourse(id, patch) { 
  setCourses(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  setTimeout(() => generateRoutine(false, false), 100);
}
function removeCourse(id) { 
  if (window.confirm('Remove course? This will remove its sections.')) {
    setCourses(prev => prev.filter(c => c.id !== id));
    // Remove all assignments for this course
    setAssignments(prev => prev.filter(a => a.courseId !== id));
    setTimeout(() => generateRoutine(false, false), 100);
  }
}
  function addBatch(b) { setBatches(prev => [...prev, { id: b.id || uid('B'), ...b }]); }
  function updateBatch(id, patch) { setBatches(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b)); }
  function removeBatch(id) { 
  if (window.confirm('Remove batch? This will remove related sections from courses too.')) { 
    setBatches(prev => prev.filter(b => b.id !== id)); 
    setCourses(prev => prev.map(c => ({ 
      ...c, 
      sections: c.sections.filter(s => s.batch !== id) 
    })));
    // Remove all assignments for this batch
    setAssignments(prev => prev.filter(a => a.batch !== id));
    setTimeout(() => generateRoutine(false, false), 100);
  } 
}
  function importJSON(json) { try { const parsed = JSON.parse(json); if (parsed.teachers) setTeachers(parsed.teachers); if (parsed.courses) setCourses(parsed.courses); if (parsed.batches) setBatches(parsed.batches); if (parsed.theoryRooms) setTheoryRooms(parsed.theoryRooms); if (parsed.labRooms) setLabRooms(parsed.labRooms); alert('Data imported'); } catch (e) { alert('Invalid JSON'); } }
  function exportJSON() { const payload = { teachers, courses, batches, theoryRooms, labRooms, assignments }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'eee_routine_data.json'; a.click(); URL.revokeObjectURL(url); }
  function clearAssignments() { if (window.confirm('Clear all generated assignments?')) { setAssignments([]); setConflicts([]); } }
  function removeAssignment(assignmentId) { setAssignments(prev => prev.filter(a => a.id !== assignmentId)); }
function exportToExcel() {
  /* global XLSX */
  if (typeof XLSX === 'undefined') {
    alert('SheetJS library is not loaded yet...');
    return;
  }

  const wb = XLSX.utils.book_new();
  
  // ========== THEORY ROUTINE SHEET ==========
  const theorySheetData = [];
  
  // Add header rows
  theorySheetData.push(['Southeast University']);
  theorySheetData.push(['School of Science & Engineering (SSE)']);
  theorySheetData.push(['Class Routine of EEE Program']);
  theorySheetData.push(['Time Frame: 08.30 To 05.50 (6 Period)']);
  theorySheetData.push([]);
  
  // Main headers
  const theoryHeaders = ['DAY', 'ROOM', 'CAP'];
  for (let i = 1; i <= 6; i++) {
    theoryHeaders.push(`PERIOD - ${i}`);
  }
  theorySheetData.push(theoryHeaders);
  
  // Time row
  const timeRow = ['', '', ''];
  for (let i = 1; i <= 6; i++) {
    timeRow.push(getTheoryTimeRange(i));
  }
  theorySheetData.push(timeRow);
  
  // Sub headers
  const subHeaders = ['', '', ''];
  for (let i = 1; i <= 6; i++) {
    subHeaders.push('COURSE / SECTION / FACULTY');
  }
  theorySheetData.push(subHeaders);
  
  // Group assignments by day and room
  const theoryRoomsList = [...theoryRooms];
  
  for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
    const dayName = DAYS[dayIndex];
    
    for (const room of theoryRoomsList) {
      const row = [dayName, room.id, room.capacity || 40];
      
      for (let slotIndex = 0; slotIndex < THEORY_SLOTS.length; slotIndex++) {
        const slot = THEORY_SLOTS[slotIndex];
        
        const assignment = assignments.find(a => 
          a.type === 'theory' && 
          a.day === dayIndex && 
          a.roomId === room.id && 
          a.slotId === slot.id
        );
        
        if (assignment) {
          const teacherId = assignment.teacher || 'TBA';
          const displayText = assignment.type === 'theory' 
    ? `${assignment.code} (${assignment.section})\n(${teacherId})`
    : `${assignment.code}\n(${teacherId})`;
  row.push(displayText);
  
        } else {
          row.push('');
        }
      }
      theorySheetData.push(row);
    }
    theorySheetData.push([]);
  }
  
  theorySheetData.push([]);
  theorySheetData.push(['*O = Old Building and N = New building']);
  
  const theorySheet = XLSX.utils.aoa_to_sheet(theorySheetData);
  
  // Apply column widths
  theorySheet['!cols'] = [
    {wch: 8},   // Day
    {wch: 10},  // Room No.
    {wch: 8},   // Capacity
    {wch: 28},  // Period 1
    {wch: 28},  // Period 2
    {wch: 28},  // Period 3
    {wch: 28},  // Period 4
    {wch: 28},  // Period 5
    {wch: 28}   // Period 6
  ];
  
  // Merge header cells
  theorySheet['!merges'] = [
    {s: {r: 0, c: 0}, e: {r: 0, c: 8}},
    {s: {r: 1, c: 0}, e: {r: 1, c: 8}},
    {s: {r: 2, c: 0}, e: {r: 2, c: 8}},
    {s: {r: 3, c: 0}, e: {r: 3, c: 8}},
  ];
  
  XLSX.utils.book_append_sheet(wb, theorySheet, "Theory");
  
  // ========== LAB ROUTINE SHEET ==========
  const labSheetData = [];
  
  labSheetData.push(['Southeast University']);
  labSheetData.push(['School of Science & Engineering (SSE)']);
  labSheetData.push(['Class Routine of EEE Program']);
  labSheetData.push(['Time Frame: 08.00 To 06.00 (5 Period)']);
  labSheetData.push([]);
  
  const labHeaders = ['DAY', 'ROOM', 'CAP'];
  for (let i = 1; i <= 5; i++) {
    labHeaders.push(`PERIOD - ${i}`);
  }
  labSheetData.push(labHeaders);
  
  // Time row for lab
  const labTimeRow = ['', '', ''];
  for (let i = 1; i <= 5; i++) {
    labTimeRow.push(getLabTimeRange(i));
  }
  labSheetData.push(labTimeRow);
  
  // Sub headers for lab
  const labSubHeaders = ['', '', ''];
  for (let i = 1; i <= 5; i++) {
    labSubHeaders.push('COURSE / SECTION / FACULTY');
  }
  labSheetData.push(labSubHeaders);
  
  const labRoomsList = [...labRooms];
  
  for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
    const dayName = DAYS[dayIndex];
    
    for (const room of labRoomsList) {
      const row = [dayName, room.id, room.capacity || 25];
      
      for (let slotIndex = 0; slotIndex < LAB_SLOTS.length; slotIndex++) {
        const slot = LAB_SLOTS[slotIndex];
        
        const assignment = assignments.find(a => 
          a.type === 'lab' && 
          a.day === dayIndex && 
          a.roomId === room.id && 
          a.slotId === slot.id
        );
        
if (assignment) {
  const teacherId = assignment.teacher || 'TBA';
  const teacherName = teachersById[assignment.teacher]?.name || teacherId;
  // Show course code with section for labs
  const displayText = assignment.type === 'lab' 
    ? `${assignment.code} (${assignment.section})\n(${teacherId})`
    : `${assignment.code}\n(${teacherId})`;
  row.push(displayText);
} else {
  row.push('');
}
      }
      labSheetData.push(row);
    }
    labSheetData.push([]);
  }
  
  const labSheet = XLSX.utils.aoa_to_sheet(labSheetData);
  
  labSheet['!cols'] = [
    {wch: 8},   // Day
    {wch: 10},  // Room No.
    {wch: 8},   // Capacity
    {wch: 28},  // Period 1
    {wch: 28},  // Period 2
    {wch: 28},  // Period 3
    {wch: 28},  // Period 4
    {wch: 28}   // Period 5
  ];
  
  labSheet['!merges'] = [
    {s: {r: 0, c: 0}, e: {r: 0, c: 7}},
    {s: {r: 1, c: 0}, e: {r: 1, c: 7}},
    {s: {r: 2, c: 0}, e: {r: 2, c: 7}},
    {s: {r: 3, c: 0}, e: {r: 3, c: 7}},
  ];
  
  XLSX.utils.book_append_sheet(wb, labSheet, "Lab");
  
  // Save the file
  XLSX.writeFile(wb, `EEE_Routine_${new Date().toLocaleDateString()}.xlsx`);
}

// Helper functions for time ranges
function getTheoryTimeRange(periodNum) {
  const ranges = {
    1: '08.30-09.50',
    2: '10.00-11.20',
    3: '11.30-12.50',
    4: '01.30-02.50',
    5: '03.00-04.20',
    6: '04.30-05.50'
  };
  return ranges[periodNum] || '';
}

function getLabTimeRange(periodNum) {
  const ranges = {
    1: '08.00-10.00',
    2: '10.00-12.00',
    3: '12.00-02.00',
    4: '02.00-04.00',
    5: '04.00-06.00'
  };
  return ranges[periodNum] || '';
}
  // ---------------------------
  // Views: build grids
  // ---------------------------
  function timetableForBatchSection(batchId, sectionId) {
    const grid = { theory: Array(7).fill(null).map(() => Array(THEORY_SLOTS.length).fill(null)), lab: Array(7).fill(null).map(() => Array(LAB_SLOTS.length).fill(null)) };
    assignments.forEach(a => { if (a.batch === batchId && a.section === sectionId) { if (a.type === 'theory') { const col = THEORY_SLOTS.findIndex(s => s.id === a.slotId); if (col >= 0) grid.theory[a.day][col] = a; } else { const col = LAB_SLOTS.findIndex(s => s.id === a.slotId); if (col >= 0) grid.lab[a.day][col] = a; } } });
    return grid;
  }

  function timetableForTeacher(teacherId) {
    const grid = { theory: Array(7).fill(null).map(() => Array(THEORY_SLOTS.length).fill(null)), lab: Array(7).fill(null).map(() => Array(LAB_SLOTS.length).fill(null)) };
    assignments.forEach(a => { if (a.teacher === teacherId) { if (a.type === 'theory') { const col = THEORY_SLOTS.findIndex(s => s.id === a.slotId); if (col >= 0) grid.theory[a.day][col] = a; } else { const col = LAB_SLOTS.findIndex(s => s.id === a.slotId); if (col >= 0) grid.lab[a.day][col] = a; } } });
    return grid;
  }

  function timetableForRoom(roomId) {
    const g = { theory: Array(7).fill(null).map(() => Array(THEORY_SLOTS.length).fill(null)), lab: Array(7).fill(null).map(() => Array(LAB_SLOTS.length).fill(null)) };
    assignments.forEach(a => { if (a.roomId === roomId) { if (a.type === 'theory') { const col = THEORY_SLOTS.findIndex(s => s.id === a.slotId); if (col >= 0) g.theory[a.day][col] = a; } else { const col = LAB_SLOTS.findIndex(s => s.id === a.slotId); if (col >= 0) g.lab[a.day][col] = a; } } });
    return g;
  }

  // ---------------------------
  // UI Components: DataTab, GeneratorTab, ViewTab
  // ---------------------------
  function DataTab() {
  const [jsonText, setJsonText] = useState("");
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [batchSectionsDraft, setBatchSectionsDraft] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseSectionsDraft, setCourseSectionsDraft] = useState([]);
  const [editingTeacherPrefsId, setEditingTeacherPrefsId] = useState(null);
  const [localUnavailable, setLocalUnavailable] = useState([]);
  const [localPreferred, setLocalPreferred] = useState([]);

  const saveBatchSections = (bid) => { updateBatch(bid, { sections: batchSectionsDraft }); setEditingBatchId(null); };
  const saveCourseSections = (cid) => { updateCourse(cid, { sections: courseSectionsDraft }); setEditingCourseId(null); };

  // SlotSelector component defined outside the return
  function SlotSelector({ teacherId, slotType, selectedSlots, onChange, isPreferred }) {
    const slots = slotType === 'theory' ? THEORY_SLOTS : LAB_SLOTS;
    const teacher = teachers.find(t => t.id === teacherId);
    const workingDays = DAYS.map((d, i) => ({ day: d, idx: i })).filter(({ idx }) => !teacher.holidays.includes(idx));

    const toggleSlot = (dayIdx, slotId) => {
      const key = slotKey(slotType, dayIdx, slotId);
      const newSlots = selectedSlots.includes(key)
        ? selectedSlots.filter(s => s !== key)
        : [...selectedSlots, key];
      onChange(newSlots);
    };

    return (
      <div className="mt-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1"></th>
              {slots.map(slot => (
                <th key={slot.id} className="border px-2 py-1">{slot.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workingDays.map(({ day, idx: dayIdx }) => (
              <tr key={day}>
                <td className="border px-2 py-1 font-medium">{day}</td>
                {slots.map(slot => {
                  const key = slotKey(slotType, dayIdx, slot.id);
                  const isSelected = selectedSlots.includes(key);
                  return (
                    <td key={slot.id} className="border px-2 py-1">
                      <button
                        className={`w-full h-8 rounded ${isSelected ? (isPreferred ? 'bg-green-200' : 'bg-red-200') : 'bg-gray-100'} hover:bg-gray-200`}
                        onClick={() => toggleSlot(dayIdx, slot.id)}
                      >
                        {isSelected ? (isPreferred ? '✓' : 'X') : '-'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Data Editor (Editable)</h2>
      <div className="grid grid-cols-3 gap-4">
        {/* Teachers Section */}
        <div className="p-3 border rounded">
          <h3 className="font-medium">Teachers ({teachers.length})</h3>
          <div className="mt-2 space-y-2">
            {teachers.map(t => (
              <div key={t.id} className="p-2 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.name} <span className="text-xs text-gray-500">({t.id})</span></div>
                    <div className="text-xs text-gray-500">Type: {t.type} | Holidays: {t.holidays.map(h => DAYS[h]).join(', ') || '-'}</div>
                  </div>
                  <div className="space-x-2">
                    <button className="px-2 py-1 text-xs bg-blue-50 rounded" onClick={() => { const newName = prompt('Edit name', t.name); if (newName) updateTeacher(t.id, { name: newName }); }}>Rename</button>
                    <button className="px-2 py-1 text-xs bg-yellow-50 rounded" onClick={() => { const newType = prompt('Type (full|guest)', t.type); if (newType) updateTeacher(t.id, { type: newType }); }}>Type</button>
                    <button className="px-2 py-1 text-xs bg-red-50 rounded" onClick={() => removeTeacher(t.id)}>Remove</button>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-xs">Holidays:</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DAYS.map((day, idx) => (
                      <label key={idx} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={t.holidays.includes(idx)}
                          onChange={() => {
                            const newHols = t.holidays.includes(idx) ? t.holidays.filter(d => d !== idx) : [...t.holidays, idx];
                            updateTeacher(t.id, { holidays: newHols.sort() });
                          }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>

                  <button
                    className="mt-2 px-3 py-1 bg-blue-100 rounded"
                    onClick={() => {
                      if (editingTeacherPrefsId === t.id) {
                        setEditingTeacherPrefsId(null);
                      } else {
                        setEditingTeacherPrefsId(t.id);
                        setLocalUnavailable(t.unavailable || []);
                        setLocalPreferred(t.preferred || []);
                      }
                    }}
                  >
                    {editingTeacherPrefsId === t.id ? 'Close Preferences' : 'Edit Preferences'}
                  </button>

                  {editingTeacherPrefsId === t.id && (
                    <div className="mt-2 space-y-2">
                      <div className="text-xs">Unavailable Theory Slots:</div>
                      <SlotSelector
                        teacherId={t.id}
                        slotType="theory"
                        selectedSlots={localUnavailable}
                        onChange={setLocalUnavailable}
                        isPreferred={false}
                      />

                      <div className="text-xs mt-2">Unavailable Lab Slots:</div>
                      <SlotSelector
                        teacherId={t.id}
                        slotType="lab"
                        selectedSlots={localUnavailable}
                        onChange={setLocalUnavailable}
                        isPreferred={false}
                      />

                      <div className="text-xs mt-2">Preferred Theory Slots (soft):</div>
                      <SlotSelector
                        teacherId={t.id}
                        slotType="theory"
                        selectedSlots={localPreferred}
                        onChange={setLocalPreferred}
                        isPreferred={true}
                      />

                      <div className="text-xs mt-2">Preferred Lab Slots (soft):</div>
                      <SlotSelector
                        teacherId={t.id}
                        slotType="lab"
                        selectedSlots={localPreferred}
                        onChange={setLocalPreferred}
                        isPreferred={true}
                      />

                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded"
                          onClick={() => {
                            updateTeacher(t.id, { unavailable: localUnavailable, preferred: localPreferred });
                            setEditingTeacherPrefsId(null);
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-300 rounded"
                          onClick={() => setEditingTeacherPrefsId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div>
              <button
                className="px-3 py-1 rounded bg-green-600 text-white"
                onClick={() => {
                  const initials = prompt('Initials (unique id), e.g. DMMH');
                  if (!initials) return;
                  const name = prompt('Full name');
                  if (!name) return;
                  const type = prompt('Type (full|guest)', 'full');
                  const holidaysStr = prompt('Holidays indices, comma separated (0=Sun ...6=Sat)', '5,6');
                  const holidays = holidaysStr.split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean);
                  addTeacher({ id: initials, name, type, holidays, unavailable: [], preferred: [] });
                }}
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>

        {/* Batches Section */}
        <div className="p-3 border rounded">
          <h3 className="font-medium">Batches ({batches.length})</h3>
          <div className="mt-2 space-y-2">
            {batches.map(b => (
              <div key={b.id}>
                <div className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{b.name} <span className="text-xs text-gray-500">({b.id})</span></div>
                      <div className="text-xs text-gray-500">Sections: {b.sections.join(', ')}</div>
                    </div>
                    <div className="space-x-2">
                      <button className="px-2 py-1 text-xs bg-blue-50 rounded" onClick={() => { setEditingBatchId(b.id); setBatchSectionsDraft([...b.sections]); }}>Edit Sections</button>
                      <button className="px-2 py-1 text-xs bg-red-50 rounded" onClick={() => removeBatch(b.id)}>Remove</button>
                    </div>
                  </div>
                </div>
                {editingBatchId === b.id && (
                  <div className="mt-1 p-2 border rounded bg-gray-50">
                    <div className="font-medium">Editing sections for {b.name}</div>
                    <div className="text-xs text-gray-500 mb-2">
                      Note: Sections are single letters like A, B, C for both theory and lab courses
                    </div>
                    <div className="mt-2 space-y-2">
                      {batchSectionsDraft.map((sec, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            className="px-2 py-1 border rounded flex-1"
                            value={sec}
                            onChange={(e) => {
                              const copy = [...batchSectionsDraft];
                              copy[idx] = e.target.value;
                              setBatchSectionsDraft(copy);
                            }}
                          />
                          <button
                            className="px-2 text-sm bg-red-50 rounded"
                            onClick={() => {
                              setBatchSectionsDraft(batchSectionsDraft.filter((_, i) => i !== idx));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                          onClick={() => setBatchSectionsDraft(prev => [...prev, 'A'])}
                        >
                          Add Section
                        </button>
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded"
                          onClick={() => saveBatchSections(b.id)}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-300 rounded"
                          onClick={() => setEditingBatchId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div>
              <button
                className="px-3 py-1 rounded bg-green-600 text-white"
                onClick={() => {
                  const name = prompt('Batch display name (e.g. Batch 13)');
                  if (!name) return;
                  const id = prompt('Batch id (e.g. Batch13)', `Batch${batches.length + 1}`);
                  const sections = prompt('Comma separated sections (e.g. A,B,C)', 'A,B');
                  if (!id) return;
                  addBatch({ id, name, sections: sections.split(',').map(s => s.trim()) });
                }}
              >
                Add Batch
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="p-3 border rounded">
          <h3 className="font-medium">Rooms</h3>
          <div className="mt-2 space-y-2">
            {[...theoryRooms, ...labRooms].map(r => (
              <div key={r.id} className="p-2 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.name} <span className="text-xs text-gray-500">({r.id})</span></div>
                    <div className="text-xs text-gray-500">Type: {r.type}</div>
                  </div>
                  <button
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => {
                      if (window.confirm(`Remove room ${r.id} (${r.name})?`)) {
                        if (r.type === 'theory') {
                          setTheoryRooms(prev => prev.filter(room => room.id !== r.id));
                        } else {
                          setLabRooms(prev => prev.filter(room => room.id !== r.id));
                        }
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
                {r.type === 'lab' && (
                  <div className="mt-2">
                    <div className="text-xs">Allowed Lab Courses (comma-separated course IDs):</div>
                    <input
                      value={(r.allowedCourses || []).join(',')}
                      onChange={(e) => {
                        const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setLabRooms(prev => prev.map(rr => rr.id === r.id ? { ...rr, allowedCourses: list } : rr));
                      }}
                      className="mt-1 px-2 py-1 border rounded w-full text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="mt-2">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => {
                  const rid = prompt('Room id e.g. TH7');
                  if (!rid) return;
                  setTheoryRooms(prev => [...prev, { id: rid, name: rid, type: 'theory' }]);
                }}
              >
                Add Theory Room
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded ml-2"
                onClick={() => {
                  const rid = prompt('Room id e.g. LB11');
                  if (!rid) return;
                  setLabRooms(prev => [...prev, { id: rid, name: rid, type: 'lab', allowedCourses: [] }]);
                }}
              >
                Add Lab Room
              </button>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="p-3 border rounded col-span-3">
          <h3 className="font-medium">Courses ({courses.length})</h3>
          <div className="mt-2 space-y-2">
            {courses.map(c => (
              <div key={c.id}>
                <div className="p-2 border rounded flex items-start justify-between">
                  <div>
                    <div className="font-medium">{c.code} — {c.title} <span className="text-xs text-gray-500">({c.type})</span></div>
                    <div className="text-xs text-gray-500">Sections: {c.sections.map(s => `${s.batch}-${s.section} (${s.teacher ? teachersById[s.teacher]?.name || s.teacher : 'TBA'})`).join(', ') || '-'} </div>
                  </div>
                  <div className="space-x-2">
                    <button className="px-2 py-1 text-xs bg-blue-50 rounded" onClick={() => { setEditingCourseId(c.id); setCourseSectionsDraft(c.sections.map(s => ({ ...s }))); }}>
                      Edit Sections
                    </button>
                    <button className="px-2 py-1 text-xs bg-red-50 rounded" onClick={() => removeCourse(c.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                {editingCourseId === c.id && (
                  <div className="mt-1 p-2 border rounded bg-gray-50">
                    <div className="font-medium">Editing sections for {c.code}</div>
                    <div className="text-xs text-gray-500 mb-2">
                      {c.type === 'lab' ? 'Use sections as A,B,C' : 'For theory courses, use sections as  A, B, C'}
                    </div>
                    <div className="mt-2 space-y-2">
                      {courseSectionsDraft.map((s, idx) => (
                        <div key={idx} className="flex gap-2">
                          <select
                            value={s.batch}
                            onChange={(e) => {
                              const copy = [...courseSectionsDraft];
                              copy[idx].batch = e.target.value;
                              setCourseSectionsDraft(copy);
                            }}
                            className="px-2 py-1 border rounded"
                          >
                            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                          <input
                            className="px-2 py-1 border rounded"
                            value={s.section}
                            onChange={(e) => {
                              const copy = [...courseSectionsDraft];
                              copy[idx].section = e.target.value;
                              setCourseSectionsDraft(copy);
                            }}
                            placeholder={c.type === 'lab' ? "e.g., A1, A2, B1, B2" : "e.g., A, B, C"}
                          />
                          <select
                            value={s.teacher || ''}
                            onChange={(e) => {
                              const copy = [...courseSectionsDraft];
                              copy[idx].teacher = e.target.value || null;
                              setCourseSectionsDraft(copy);
                            }}
                            className="px-2 py-1 border rounded"
                          >
                            <option value="">TBA</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.id})</option>)}
                          </select>
                          <button
                            className="px-2 text-sm bg-red-50 rounded"
                            onClick={() => setCourseSectionsDraft(courseSectionsDraft.filter((_, i) => i !== idx))}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                          onClick={() => {
                            const defaultSection = c.type === 'lab' ? 'A1' : 'A';
                            setCourseSectionsDraft(prev => [...prev, { batch: batches[0]?.id || '', section: defaultSection, teacher: null }]);
                          }}
                        >
                          Add Section
                        </button>
                      
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded"
                          onClick={() => saveCourseSections(c.id)}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-300 rounded"
                          onClick={() => setEditingCourseId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-2">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={() => {
                  const code = prompt('Course code (e.g. EEE112)');
                  if (!code) return;
                  const title = prompt('Course title');
                  if (!title) return;
                  const type = prompt('Type (theory|lab)', 'theory');
                  
                if (type === 'lab') {
                const sectionsRaw = prompt('Section entries (format Batch50:A;Batch50:B) e.g. Batch49:A,B', `${batches[0]?.id}:A`);
                const sections = [];
                 sectionsRaw.split(';').forEach(part => {
                const [batch, secs] = part.split(':');
                if (!batch) return;
              (secs || '').split(',').map(s => s.trim()).filter(Boolean).forEach(s => sections.push({ batch: batch.trim(), section: s, teacher: null }));
                });
                 addCourse({ id: code, code, title, type, sections });
                }}
                }
              >
                Add Course
              </button>
            </div>
          </div>
        </div>

        {/* Import/Export Section */}
        <div className="p-3 border rounded col-span-3">
          <h3 className="font-medium">Import / Export</h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <textarea
              className="col-span-2 p-2 border rounded h-28"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste JSON export here to import"
            />
            <div className="space-y-2">
              <button className="w-full px-3 py-1 rounded bg-indigo-600 text-white" onClick={() => importJSON(jsonText)}>
                Import JSON
              </button>
              <button className="w-full px-3 py-1 rounded bg-gray-600 text-white" onClick={() => exportJSON()}>
                Export JSON
              </button>
              <button
                className="w-full px-3 py-1 rounded bg-yellow-500 text-white"
                onClick={() => {
                  if (window.confirm('Reset everything to seed data?')) {
                    setTeachers(clone(SEED_TEACHERS));
                    setBatches(clone(SEED_BATCHES));
                    setTheoryRooms(clone(DEFAULT_THEORY_ROOMS));
                    setLabRooms(clone(DEFAULT_LAB_ROOMS));
                    setCourses(clone(SEED_COURSES));
                    setAssignments([]);
                  }
                }}
              >
                Reset to Seed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function GeneratorTab() {
  const teacherCredits = useMemo(() => {
    const credits = {};
    teachers.forEach(t => { credits[t.id] = 0; });
    courses.forEach(c => {
      const creditPerSection = c.type === 'theory' ? 3 : 1;
      c.sections.forEach(s => {
        if (s.teacher) credits[s.teacher] = (credits[s.teacher] || 0) + creditPerSection;
      });
    });
    return credits;
  }, [courses, teachers]);

  // Add this confirmation function
  const handleGenerateNewRoutine = () => {
    const confirmMessage = '⚠️ WARNING: Generate New Routine will DELETE your current routine and create a completely new one.\n\nAre you sure you want to continue?';
    if (window.confirm(confirmMessage)) {
      generateRoutine(true);
    }
  };

  // Add this confirmation for reset routine
  const handleResetRoutine = () => {
    const confirmMessage = '⚠️ This will clear ALL current assignments.\n\nAre you sure?';
    if (window.confirm(confirmMessage)) {
      clearAssignments();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Routine Generator</h2>
      <div className="flex gap-3">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" 
          onClick={handleGenerateNewRoutine}  // Changed this
        >
          Generate New Routine
        </button>
   <button 
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" 
  onClick={() => {
    if (window.confirm('Are you sure you want to update the routine with the current changes?')) {
      generateRoutine(false, true);
    }
  }}
>
  Update Routine
</button>
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition" 
          onClick={handleResetRoutine}  // Changed this
        >
          Reset Routine
        </button>
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition" 
          onClick={() => exportToExcel()}
        >
          Export to Excel
        </button>
        <button 
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition" 
          onClick={() => exportJSON()}
        >
          Export Data & Routine
        </button>
      </div>
 

        <div className="p-3 border rounded">
          <h3 className="font-medium">Conflicts</h3>
          <div className="mt-2 text-sm text-gray-700">
            {conflicts.length === 0 ? (
              <div className="text-green-700">No conflicts found (or none detected by the greedy solver).</div>
            ) : (
              conflicts.map((c, i) => (
                <div key={i} className="p-2 bg-yellow-50 border rounded">
                  {c.inst.code} ({c.inst.batch}-{c.inst.section}) — {c.reason}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-medium">Teacher Credits</h3>
          <div className="mt-2 space-y-1">
            {teachers.map(t => (
              <div key={t.id} className="text-sm">
                {t.name} ({t.id}): {teacherCredits[t.id] || 0} credits
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border rounded">
          <h3 className="font-medium">Summary</h3>
          <div className="mt-2 grid grid-cols-3 gap-3">
            <div className="p-2 border rounded">
              <div className="text-sm text-gray-600">#Assignments</div>
              <div className="text-xl font-bold">{assignments.length}</div>
            </div>
            <div className="p-2 border rounded">
              <div className="text-sm text-gray-600">Teachers</div>
              <div className="text-xl font-bold">{teachers.length}</div>
            </div>
            <div className="p-2 border rounded">
              <div className="text-sm text-gray-600">Courses</div>
              <div className="text-xl font-bold">{courses.length}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ViewTab() {
    const selectedBatchObj = batches.find(b => b.id === selectedBatch) || batches[0];
    const sectionsList = selectedBatchObj ? selectedBatchObj.sections : [];
    const batchGrid = timetableForBatchSection(selectedBatch, selectedSection);
    const teacherGrid = timetableForTeacher(selectedTeacher);
    const roomGrid = selectedRoom ? timetableForRoom(selectedRoom) : null;

    function isValidShiftTarget(ass, targetDay, targetSlotId, targetSlotIdx) {
      const teacher = ass.teacher ? teachersById[ass.teacher] : null;
      if (teacher && teacher.holidays.includes(targetDay)) return false;
      const type = ass.type;
      const unavailable = teacher ? (teacher.unavailable || []) : [];
      if (teacher && unavailable.includes(slotKey(type, targetDay, targetSlotId))) return false;
      if (teacher && teacherHasConflictExcluding(ass.teacher, type, targetDay, targetSlotId, ass.id)) return false;
      if (studentHasConflictExcluding(ass.batch, ass.section, type, targetDay, targetSlotId, ass.id)) return false;
      if (studentDailyCountExcluding(ass.batch, ass.section, targetDay, ass.id) >= MAX_CLASSES_PER_DAY) return false;
      if (teacher && teacherDailyCountExcluding(ass.teacher, targetDay, ass.id) >= MAX_CLASSES_PER_DAY) return false;
      if (causesLongGapExcluding(ass.batch, ass.section, type, targetDay, targetSlotIdx, ass.id)) return false;
      if (teacher && teacherCausesLongGapExcluding(ass.teacher, type, targetDay, targetSlotIdx, ass.id)) return false;
      if (studentHasOverlapWithOtherTypeExcluding(ass.batch, ass.section, type, targetDay, targetSlotId, ass.id)) return false;
      if (teacher && teacherHasOverlapWithOtherTypeExcluding(ass.teacher, type, targetDay, targetSlotId, ass.id)) return false;

      // Check for at least one free room
      const roomsSource = type === 'theory' ? theoryRooms : labRooms;
      const allowed = roomsSource.filter(r => !r.allowedCourses || r.allowedCourses.length === 0 || r.allowedCourses.includes(ass.courseId));
      const candidateRooms = allowed.length ? allowed : roomsSource;
      const availableRooms = candidateRooms.filter(r => !assignments.some(a => a.id !== ass.id && a.roomId === r.id && a.type === type && a.day === targetDay && a.slotId === targetSlotId));
      if (availableRooms.length === 0) return false;

      return true;
    }

    function handleShiftTo(ass, targetDay, targetSlotId, targetSlotLabel, targetSlotIdx) {
      const type = ass.type;
      const roomsSource = type === 'theory' ? theoryRooms : labRooms;
      const allowed = roomsSource.filter(r => !r.allowedCourses || r.allowedCourses.length === 0 || r.allowedCourses.includes(ass.courseId));
      const candidateRooms = allowed.length ? allowed : roomsSource;
      const availableRooms = candidateRooms.filter(r => !assignments.some(a => a.id !== ass.id && a.roomId === r.id && a.type === type && a.day === targetDay && a.slotId === targetSlotId));
      if (availableRooms.length === 0) {
        alert('No available rooms for this slot.');
        return;
      }
      const roomOptions = availableRooms.map(r => `${r.id} - ${r.name}`).join('\n');
      const roomId = prompt(`Select available room:\n${roomOptions}`);
      if (!roomId || !availableRooms.some(r => r.id === roomId)) return;
      setAssignments(prev => prev.map(a => a.id === ass.id ? { ...a, day: targetDay, dayName: DAYS[targetDay], slotId: targetSlotId, slotLabel: targetSlotLabel, roomId } : a));
      setShiftingAssignment(null);
    }

    function renderGridCell(grid, type, di, si, viewType) {
      const slots = type === 'theory' ? THEORY_SLOTS : LAB_SLOTS;
      const a = grid[type][di][si];
      const slot = slots[si];
      if (a) {
        const bgColor = type === 'theory' ? 'bg-blue-50' : 'bg-yellow-50';
        let content;
        if (viewType === 'batch') {
          content = (
            <>
              <div className="font-semibold">{a.code}</div>
              <div className="text-xs">{a.roomId} | {a.teacher ? teachersById[a.teacher]?.name || a.teacher : 'TBA'}</div>
            </>
          );
        } else if (viewType === 'teacher') {
          content = (
            <>
              <div className="font-semibold">{a.code}</div>
              <div className="text-xs">{a.roomId} | {a.batch}-{a.section}</div>
            </>
          );
        } else if (viewType === 'room') {
          content = (
            <>
              <div className="font-semibold">{a.code}</div>
              <div className="text-xs">{a.batch}-{a.section} | {a.teacher ? teachersById[a.teacher]?.name || a.teacher : 'TBA'}</div>
            </>
          );
        }
        return (
          <div className={`p-1 ${bgColor} rounded`}>
            {content}
            <div className="mt-1 flex gap-2">
              <button
                className="text-red-600 text-xs"
                onClick={() => {
                  if (window.confirm('Remove this assignment?')) removeAssignment(a.id);
                }}
              >
                Remove
              </button>
              <button
                className="text-blue-600 text-xs"
                onClick={() => setShiftingAssignment(a)}
              >
                Shift
              </button>
            </div>
          </div>
        );
      } else if (shiftingAssignment && shiftingAssignment.type === type) {
        const isValid = isValidShiftTarget(shiftingAssignment, di, slot.id, slot.idx);
        if (isValid) {
          return (
            <button
              className="text-green-600 text-xl"
              onClick={() => handleShiftTo(shiftingAssignment, di, slot.id, slot.label, slot.idx)}
            >
              ✓
            </button>
          );
        } else {
          return <span className="text-red-600 text-xl">✗</span>;
        }
      } else {
        return <div className="text-xs text-gray-400">-</div>;
      }
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Timetable Viewer</h2>
          <div className="space-x-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="data">Data</option>
              <option value="generator">Generator</option>
              <option value="view">Viewer</option>
            </select>
          </div>
        </div>

        {shiftingAssignment && (
          <div className="p-2 bg-yellow-100 rounded flex items-center gap-2">
            <span>Shifting {shiftingAssignment.code} ({shiftingAssignment.batch}-{shiftingAssignment.section})</span>
            <button className="px-2 py-1 bg-red-200 rounded text-sm" onClick={() => setShiftingAssignment(null)}>Cancel</button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 border rounded">
            <h3 className="font-medium">Batch/Section View</h3>
            <div className="mt-2 space-y-2">
              <select
                className="px-2 py-1 border rounded"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  const b = batches.find(x => x.id === e.target.value);
                  setSelectedSection(b?.sections?.[0] || '');
                }}
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <select
                className="px-2 py-1 border rounded"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {sectionsList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <div className="mt-2">
                <h4 className="font-medium">Theory Timetable</h4>
                <div className="overflow-auto mt-2">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Day</th>
                        {THEORY_SLOTS.map(s => (
                          <th key={s.id} className="border px-2 py-1">{s.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((d, di) => (
                        <tr key={d}>
                          <td className="border px-2 py-1 font-medium">{d}</td>
                          {THEORY_SLOTS.map((s, si) => (
                            <td key={s.id} className="border px-2 py-1 align-top h-20">
                              {renderGridCell(batchGrid, 'theory', di, si, 'batch')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">Lab Timetable</h4>
                <div className="overflow-auto mt-2">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Day</th>
                        {LAB_SLOTS.map(s => (
                          <th key={s.id} className="border px-2 py-1">{s.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((d, di) => (
                        <tr key={d}>
                          <td className="border px-2 py-1 font-medium">{d}</td>
                          {LAB_SLOTS.map((s, si) => (
                            <td key={s.id} className="border px-2 py-1 align-top h-20">
                              {renderGridCell(batchGrid, 'lab', di, si, 'batch')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border rounded">
            <h3 className="font-medium">Teacher View</h3>
            <div className="mt-2">
              <select
                className="px-2 py-1 border rounded"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                ))}
              </select>
            </div>

            <div className="mt-3">
              <div className="text-sm font-medium">Theory</div>
              <div className="overflow-auto mt-2">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Day</th>
                      {THEORY_SLOTS.map(s => (
                        <th key={s.id} className="border px-2 py-1">{s.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((d, di) => (
                      <tr key={d}>
                        <td className="border px-2 py-1 font-medium">{d}</td>
                        {THEORY_SLOTS.map((s, si) => (
                          <td key={s.id} className="border px-2 py-1 align-top h-20">
                            {renderGridCell(teacherGrid, 'theory', di, si, 'teacher')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-sm font-medium">Lab</div>
              <div className="overflow-auto mt-2">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Day</th>
                      {LAB_SLOTS.map(s => (
                        <th key={s.id} className="border px-2 py-1">{s.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((d, di) => (
                      <tr key={d}>
                        <td className="border px-2 py-1 font-medium">{d}</td>
                        {LAB_SLOTS.map((s, si) => (
                          <td key={s.id} className="border px-2 py-1 align-top h-20">
                            {renderGridCell(teacherGrid, 'lab', di, si, 'teacher')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-3 border rounded">
            <h3 className="font-medium">Room View</h3>
            <div className="mt-2">
              <select
                className="px-2 py-1 border rounded"
                value={selectedRoom || ''}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value=''>Select a room</option>
                {[...theoryRooms, ...labRooms].map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.id})</option>
                ))}
              </select>
            </div>
            {selectedRoom && (
              <div className="mt-3 text-sm">
                <div className="font-medium">Theory</div>
                <div className="overflow-auto mt-2">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Day</th>
                        {THEORY_SLOTS.map(s => (
                          <th key={s.id} className="border px-2 py-1">{s.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((d, di) => (
                        <tr key={d}>
                          <td className="border px-2 py-1 font-medium">{d}</td>
                          {THEORY_SLOTS.map((s, si) => (
                            <td key={s.id} className="border px-2 py-1 align-top h-20">
                              {renderGridCell(roomGrid, 'theory', di, si, 'room')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="font-medium mt-3">Lab</div>
                <div className="overflow-auto mt-2">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Day</th>
                        {LAB_SLOTS.map(s => (
                          <th key={s.id} className="border px-2 py-1">{s.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((d, di) => (
                        <tr key={d}>
                          <td className="border px-2 py-1 font-medium">{d}</td>
                          {LAB_SLOTS.map((s, si) => (
                            <td key={s.id} className="border px-2 py-1 align-top h-20">
                              {renderGridCell(roomGrid, 'lab', di, si, 'room')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------
  // Main render
  // ---------------------------
  return (
    <>
      {authLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      ) : !user ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-4">EEE Routine Maker</h1>
            <p className="text-gray-600 mb-6">Southeast University</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Get Started
            </button>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 text-gray-900">
       {/* <SaveIndicator /> */}
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
          
          <header className="bg-white shadow p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">EEE Routine Maker — Southeast University</h1>
                <div className="text-xs text-gray-600">
                  Welcome, {user.username} | Your data is saved in cloud
                </div>
              </div>
              <div className="space-x-2 flex items-center">
                <button
                  className={`px-3 py-1 rounded ${activeTab === 'data' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                  onClick={() => setActiveTab('data')}
                >
                  Data
                </button>
                <button
                  className={`px-3 py-1 rounded ${activeTab === 'generator' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                  onClick={() => setActiveTab('generator')}
                >
                  Generator
                </button>
                <button
                  className={`px-3 py-1 rounded ${activeTab === 'view' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                  onClick={() => setActiveTab('view')}
                >
                  Viewer
                </button>
                <button className="px-3 py-1 rounded bg-gray-700 text-white" onClick={exportJSON}>
                  Export
                </button>
                <button
                  onClick={signout}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto mt-6">
            {activeTab === 'data' && <DataTab />}
            {activeTab === 'generator' && <GeneratorTab />}
            {activeTab === 'view' && <ViewTab />}
          </main>

          <footer className="max-w-6xl mx-auto p-4 text-xs text-gray-500">
            <div>Your data is automatically saved to cloud. Sign in from anywhere to access your routines.</div>
          </footer>
        </div>
      )}
    </>
  );
}