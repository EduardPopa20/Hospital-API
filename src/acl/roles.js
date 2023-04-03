const acl = {
  manager: {
    // Doctors Management
    getDoctors: true,
    getDoctor: true,
    createDoctor: true,
    updateDoctor: true,
    deleteDoctor: true,
    getDoctorsReport: true,
    // Patients Management
    getAllPatients: true,
    getPatient: true,
    createPatient: true,
    updatePatient: true,
    deletePatient: true,
    // Assistants management
    getAllAssistants: true,
    createAssistant: true,
    updateAssistant: true,
    deleteAssistant: true,
    getAssistantPatients: true,
    associatePatientToAssistant: true,
    disassociatePatientFromAssistant: true,
    associatePatientToDoctor: true,
    disassociatePatientFromDoctor: true,
    // Treatment management
    getAllTreatments: true,
    createTreatment: true,
    updateTreatment: true,
    deleteTreatment: true,
    getAssignedPatients: true,
    getAppliedTreatments: true,

    // Report management
    getDoctorsReport: true,
    getPatientReport: true,
  },
  doctor: {
    // Patients Management
    getPatients: true,
    getPatient: true,
    createPatient: true,
    updatePatient: true,
    deletePatient: true,
    getAssignedPatients: true,

    associatePatientToAssistant: true,
    disassociatePatientFromAssistant: true,
    associatePatientToDoctor: true,
    disassociatePatientFromDoctor: true,
    // Treatment Management
    createTreatment: true,
    deleteTreatment: true,
    getPrescribedTreatments: true,
    getAppliedTreatments: true,
  },
  assistant: {
    getAssignedPatients: true,
    applyTreatment: true,
  },
};

module.exports = acl;
