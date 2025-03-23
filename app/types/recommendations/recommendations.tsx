export interface recommendations{
    clientname:string;
    problem:string;
    age:number;
    message:string;
    date:string;
    
}

export const MockData:recommendations[]=[
    {
        clientname: "Aarav Sharma",
        problem: "Anxiety",
        age: 25,
        message: "Practice deep breathing exercises daily and maintain a journal.",
        date: "2025-03-23",
      },
      {
        clientname: "Meera Patel",
        problem: "Depression",
        age: 30,
        message: "Engage in 30 minutes of physical activity and structured social interactions.",
        date: "2025-03-22",
      },
      {
        clientname: "Rohan Verma",
        problem: "Insomnia",
        age: 27,
        message: "Follow a consistent sleep schedule and avoid screens before bedtime.",
        date: "2025-03-21",
      },
      {
        clientname: "Sanya Kapoor",
        problem: "Stress Management",
        age: 22,
        message: "Try guided meditation and relaxation techniques before starting the day.",
        date: "2025-03-20",
      },
      {
        clientname: "Kunal Mehta",
        problem: "Social Anxiety",
        age: 28,
        message: "Practice small talk in safe environments and gradually increase social exposure.",
        date: "2025-03-19",
      },
      {
        clientname: "Neha Bansal",
        problem: "Overthinking",
        age: 26,
        message: "Practice mindfulness exercises and focus on present-moment awareness.",
        date: "2025-03-18",
      },
]

