// Date in format
const date = new Date().toLocaleDateString('en-GB');
const time = new Date().toLocaleTimeString('en-GB');

// ISO 8601
const date2 = new Date();
const danishDate = Intl.DateTimeFormat('da-DK').format(date2);
console.log(danishDate);
const americanDate = Intl.DateTimeFormat('en-US').format(date2);
console.log(americanDate); 
