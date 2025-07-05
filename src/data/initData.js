export const initialData = {
  users: [
    {
      id: '1',
      role: 'Admin',
      email: 'admin@entnt.in',
      password: 'admin123'
    },
    {
      id: '2',
      role: 'Patient',
      email: 'john@entnt.in',
      password: 'patient123',
      patientId: 'p1',
      contact: '1234567890'
    }
  ],
  patients: [
    {
      id: 'p1',
      name: 'John Doe',
      dob: '1990-05-10',
      contact: '1234567890',
      healthInfo: 'No allergies'
    },
    { id: 'p2', name: 'Priya Verma', dob: '1992-04-22', contact: '9123456780', healthInfo: 'Asthma', status: 'Active' },
    { id: 'p3', name: 'Ankit Patel', dob: '1987-06-18', contact: '9988776655', healthInfo: 'Diabetic', status: 'Inactive' },
    { id: 'p4', name: 'Sneha Das', dob: '1995-11-12', contact: '9090909090', healthInfo: 'None', status: 'Active' },
    { id: 'p5', name: 'Arjun Mehta', dob: '1980-09-30', contact: '9811122233', healthInfo: 'High BP', status: 'Blocked' },
    { id: 'p6', name: 'Pooja Nair', dob: '1996-02-05', contact: '9000011122', healthInfo: 'Allergic to penicillin', status: 'Active' },
    { id: 'p7', name: 'Ravi Iyer', dob: '1985-03-21', contact: '9012345678', healthInfo: 'Thyroid', status: 'Inactive' },
    { id: 'p8', name: 'Kiran Bhatt', dob: '1993-07-14', contact: '9123434567', healthInfo: 'Migraines', status: 'Active' },
    { id: 'p9', name: 'Meena Reddy', dob: '1990-10-10', contact: '9456783210', healthInfo: 'None', status: 'Active' },
    { id: 'p10', name: 'Vikas Singh', dob: '1988-12-02', contact: '9765432100', healthInfo: 'Anxiety', status: 'Blocked' },
    { id: 'p11', name: 'Divya Ghosh', dob: '1997-08-09', contact: '9000099990', healthInfo: 'Low BP', status: 'Active' },
    { id: 'p12', name: 'Nikhil Chauhan', dob: '1994-05-06', contact: '9988771122', healthInfo: 'Smoker', status: 'Inactive' },
    { id: 'p13', name: 'Shreya Menon', dob: '1991-01-25', contact: '9998887776', healthInfo: 'Pregnant', status: 'Active' },
    { id: 'p14', name: 'Amit Tiwari', dob: '1989-06-01', contact: '9898989898', healthInfo: 'Hypertension', status: 'Active' },
    { id: 'p15', name: 'Neha Sinha', dob: '1998-03-15', contact: '9876567890', healthInfo: 'Iron deficiency', status: 'Active' }
  ],
  incidents: [
    {
      id: 'i1',
      patientId: 'p1',
      title: 'Toothache',
      description: 'Upper molar pain',
      comments: 'Sensitive to cold',
      appointmentDate: '2025-07-01T10:00:00',
      cost: 80,
      treatment: 'Filling',
      status: 'Completed',
      nextDate: '2025-07-20T10:00:00',
      files: [
        {
          name: 'invoice.pdf',
          url: 'data:application/pdf;base64,...' // Replace with real base64 or blob URL
        },
        {
          name: 'xray.png',
          url: 'data:image/png;base64,...' // Replace with real base64 or blob URL
        }
      ]
    }
  ]
};

export const seedLocalStorage = () => {
  if (!localStorage.getItem('users')) {
    Object.entries(initialData).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }
};
