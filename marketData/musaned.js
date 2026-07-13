/* ---------------- Mock "مساند" (domestic worker platform) data ---------------- */
/* This simulates the recruiter/salary record a real مساند integration would return
   for the demo user's sponsored domestic worker contract. No real government API is called. */
const MUSANED_WORKERS = [
  {
    name: 'روزاليندا دلا كروز',
    jobTitle: 'عاملة منزلية',
    nationality: 'الفلبين',
    contractNumber: 'MUS-77341829',
    monthlySalary: 1300,
    status: 'ساري'
  }
];

async function getMusanedWorkers(){
  return MUSANED_WORKERS;
}

module.exports = { getMusanedWorkers };
