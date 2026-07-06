export const localities = [
  { id: '1', name: "Connaught Place", riskStatus: 'Low', currentRisk: 15, pathogen: 'None', affectedPop: '0' },
  { id: '2', name: "Dwarka", riskStatus: 'Moderate', currentRisk: 45, pathogen: 'Hepatitis E', affectedPop: '3,100' },
  { id: '3', name: "Saket", riskStatus: 'Low', currentRisk: 22, pathogen: 'None', affectedPop: '0' },
  { id: '4', name: "Hauz Khas", riskStatus: 'Low', currentRisk: 18, pathogen: 'None', affectedPop: '0' },
  { id: '5', name: "Rohini", riskStatus: 'Moderate', currentRisk: 48, pathogen: 'Acute Diarrhea', affectedPop: '1,200' },
  { id: '6', name: "Karol Bagh", riskStatus: 'Low', currentRisk: 20, pathogen: 'None', affectedPop: '0' },
  { id: '7', name: "Lajpat Nagar", riskStatus: 'Moderate', currentRisk: 42, pathogen: 'Typhoid (S. Typhi)', affectedPop: '500' },
  { id: '8', name: "Janakpuri", riskStatus: 'High', currentRisk: 70, pathogen: 'Typhoid (S. Typhi)', affectedPop: '5,000' },
  { id: '9', name: "Vasant Kunj", riskStatus: 'Low', currentRisk: 12, pathogen: 'None', affectedPop: '0' },
  { id: '10', name: "Pitampura", riskStatus: 'Moderate', currentRisk: 35, pathogen: 'Acute Diarrhea', affectedPop: '800' },
  { id: '11', name: "Mayur Vihar", riskStatus: 'High', currentRisk: 68, pathogen: 'Typhoid (S. Typhi)', affectedPop: '4,500' },
  { id: '12', name: "Paschim Vihar", riskStatus: 'Low', currentRisk: 25, pathogen: 'None', affectedPop: '0' },
  { id: '13', name: "Model Town", riskStatus: 'Low', currentRisk: 19, pathogen: 'None', affectedPop: '0' },
  { id: '14', name: "Green Park", riskStatus: 'Low', currentRisk: 15, pathogen: 'None', affectedPop: '0' },
  { id: '15', name: "Chanakyapuri", riskStatus: 'Low', currentRisk: 8, pathogen: 'None', affectedPop: '0' },
  { id: '16', name: "Greater Kailash", riskStatus: 'Low', currentRisk: 14, pathogen: 'None', affectedPop: '0' },
  { id: '17', name: "Defense Colony", riskStatus: 'Low', currentRisk: 10, pathogen: 'None', affectedPop: '0' },
  { id: '18', name: "Patparganj", riskStatus: 'Moderate', currentRisk: 38, pathogen: 'Hepatitis E', affectedPop: '1,100' },
  { id: '19', name: "Sarita Vihar", riskStatus: 'High', currentRisk: 72, pathogen: 'Typhoid (S. Typhi)', affectedPop: '6,200' },
  { id: '20', name: "Okhla Phase 1", riskStatus: 'Critical', currentRisk: 88, pathogen: 'Cholera (V. cholerae)', affectedPop: '12,500' },
];

export const riskTrendData = [
  { day: 'Day 1', historical: 40 },
  { day: 'Day 2', historical: 42 },
  { day: 'Day 3', historical: 38 },
  { day: 'Day 4', historical: 50 },
  { day: 'Day 5', historical: 55 },
  { day: 'Day 6', historical: 48 },
  { day: 'Day 7', historical: 60 },
  { day: 'Day 8', historical: 58 },
  { day: 'Day 9', historical: 62 },
  { day: 'Day 10', historical: 65 },
  { day: 'Day 11', historical: 70 },
  { day: 'Day 12', historical: 80 },
  { day: 'Day 13', historical: 85 },
  { day: 'Today', historical: 88, forecast: 88 },
  { day: 'Day 15', forecast: 92 },
  { day: 'Day 16', forecast: 95 },
  { day: 'Day 17', forecast: 90 },
  { day: 'Day 18', forecast: 85 },
  { day: 'Day 19', forecast: 70 },
  { day: 'Day 20', forecast: 65 },
  { day: 'Day 21', forecast: 50 },
];

export const pathogenData = [
  { name: 'V. cholerae', value: 45 },
  { name: 'S. Typhi', value: 30 },
  { name: 'Hepatitis E', value: 15 },
  { name: 'Other', value: 10 },
];

export const chatResponses = {
  "default": "Based on current sensor data and predictive models, the immediate threat is contained, but continued monitoring is advised.",
  "okhla": "Okhla is currently at CRITICAL risk due to a significant spike in dissolved contaminants. Emergency protocols are recommended.",
  "cholera": "Cholera markers have increased by 45% in the last 48 hours in Okhla Phase 1. Water supply diversion is highly recommended.",
};
