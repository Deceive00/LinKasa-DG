declare type Guest = {
  email: string;
  name: string;
  password: string;
  role: string;
};

declare type User = {
  id: string;
  email: string;
  name: string;
  role: string;

};

declare type JobVacancy = {
  title: string;
  description: string;
  location: string;
  qualifications: string[];
  skills: string[];
  deadline: Date;
  salary: int;
  seats: int;
  applicant: string[];
};

declare type GlobalChat = {
  id: string;
  text: string;
  senderID: string; 
  createdAt: Date;
  role: string;
}

declare type Message = {
  content: string,
  senderRole: string,
  time: Date
}

declare type InterdepartmentChat = {
  senderRole: string[],
  message: Message[]
}

declare type LostItem = {
  uid: string;
  name: string;
  description: string;
  lostDate : Date;
  lostLocation: string;
  status: string;
  photos: string;
}

declare type ProjectPlan = {
  uid: string;
  title: string;
  description: string;
  projectManagerName: string;
  status: string;
  fundRequestID: string;
  createdAt: Date;
}

declare type FundRequest = {
  uid: string;
  projectID: string;
  status: string;
  purpose: string;
  requestedAmount: string;
  requestDate: Date;
  
}

declare type IncidentLog = {
  incidentID: string;
  nature: string;
  location: string;
  time: Date
}

declare type Baggage = {
  uid: string;
  weight: number;
  width: number;
  height: number;
  baggageGroundStatus: string;
  baggageHandlingStatus: string;
  passengerID: string;
  passengerName:string;
  photos: string;
}

declare type TerminalMap = {
  location: string;
}

declare type Infrastructure = {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
}

declare type Question = {
  content: string;
  type: string;
}

declare type FeedbackForm = {
  id: string;
  title: string;
  createdAt: Date;
  questions : Question[];
  
}

declare type EmployeeTraining = {
  id: string;
  schedule: Date;
  listEmployee: string[];
  topic: string;
  location: string;
  instructor: string;
}

declare type JobCandidates = {
  name: string;
  email: string;
  phoneNumber: string;
  dob: Date;

}

declare type Interview = {
  id: string;
  candidateID: string;
  jobPosition: string;
  location: string;
  schedule: Date;
}

declare type BaggageIncidentLog= {
  incidentID: string;
  description: string;
  actionTaken: string;
  time: Date;
}


declare type Airplane = {
  id: string;
  status: string;
  company: string;
}

declare type Flight = {
  airplaneID: string;
  id: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  status: string;
  passengerList: Passenger[];
} 

declare type Passenger = {
  name: string;
  email: string;
  phoneNumber: string;
  dob: Date;
}

declare type Maintenance = {
  infrastructureID: string;
  infrastructureName: string;
  id: string;
  schedule: Date;
  personnel: string[];
  status: string;
}