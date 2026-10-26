// Precomputed PBKDF2-SHA256 demo credentials; no runtime plaintext PINs.
import type {SchoolGroup,StudentAccount,InitialRoster} from '../types/system';
export const initialSchoolGroup:SchoolGroup = {
  "schoolCode": "MABINI-01",
  "displayName": "Mabini Elementary & High School",
  "adminEmail": "",
  "adminPasscodeHash": "4a7f056c677f65c123df7f720c0b16d23985cb68139084d01c8af8cff253e431",
  "adminPasscodeSalt": "7e1bebd80bfe2614c4df1b7df878ca9e",
  "createdAt": "2026-10-26T00:00:00.000Z",
  "maxStudents": 100,
  "allowSelfRegistration": true
};
export const demoStudents:StudentAccount[] = [
  {
    "studentId": "754c41ad-f6c0-4f80-8a72-2ddf3b5ba001",
    "schoolCode": "MABINI-01",
    "displayName": "Aya Cruz",
    "gradeLevel": "preschool",
    "isHighSchoolFoundations": false,
    "pinHash": "a6c531a3fc2078341ef665b3fbbf1a6ce8097be437231cc0d3d7f01484aff602",
    "pinSalt": "81ec5755c00000bd7a553f8fd5a8de08",
    "avatarId": "tarsier",
    "createdAt": "2026-10-26T00:00:00.000Z",
    "lastLoginAt": "2026-10-26T00:00:00.000Z"
  },
  {
    "studentId": "754c41ad-f6c0-4f80-8a72-2ddf3b5ba002",
    "schoolCode": "MABINI-01",
    "displayName": "Joshua Dizon",
    "gradeLevel": "elem_lower",
    "isHighSchoolFoundations": false,
    "pinHash": "34b08267a818d8281baed2771695dc32d1f1a1facc00a859b5dddcba1bcd4ea5",
    "pinSalt": "0fd0d748a5d157b3244134d3b36183f7",
    "avatarId": "mango",
    "createdAt": "2026-10-26T00:00:00.000Z",
    "lastLoginAt": "2026-10-26T00:00:00.000Z"
  },
  {
    "studentId": "754c41ad-f6c0-4f80-8a72-2ddf3b5ba003",
    "schoolCode": "MABINI-01",
    "displayName": "Bea Ramos",
    "gradeLevel": "elem_upper",
    "isHighSchoolFoundations": false,
    "pinHash": "0818e6d32680ca2cc3addb961d90e988ac1ff4c75ba2d55655b03110c7fc37a7",
    "pinSalt": "084bf522e026b2f0bacab9b1cc31016a",
    "avatarId": "jeepney",
    "createdAt": "2026-10-26T00:00:00.000Z",
    "lastLoginAt": "2026-10-26T00:00:00.000Z"
  },
  {
    "studentId": "754c41ad-f6c0-4f80-8a72-2ddf3b5ba004",
    "schoolCode": "MABINI-01",
    "displayName": "Mark Santos",
    "gradeLevel": "highschool",
    "isHighSchoolFoundations": true,
    "pinHash": "7eb9dfeec9c0c4f04e12636e18c60f8d1685293e34e88ab528935e823163846b",
    "pinSalt": "ae0fbf754ac600409f2c2cb9929600bd",
    "avatarId": "eagle",
    "createdAt": "2026-10-26T00:00:00.000Z",
    "lastLoginAt": "2026-10-26T00:00:00.000Z"
  }
];

/** Return independent seeds so consumer mutations never change later initializations. */
export async function createInitialRoster():Promise<InitialRoster> {
 return {school:{...initialSchoolGroup},students:demoStudents.map(student=>({...student}))};
}
