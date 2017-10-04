const GRADES = [
  "1-", "1", "1+", "2-", "2", "2+", "3-", "3", "3+",
  "4-", "4", "4+", "5-", "5", "5+", "6-", "6", "6+"
];

chrome.storage.local.get({
  "grades": GRADES
}, (items) => {
  createTable(items["grades"]);
});

function createTable(grades) {
  let table = document.getElementById("settings");

  grades.forEach((grade, index) => {
    let row = table.insertRow(-1);
    let gradeBefore = row.insertCell(-1);
    let gradeAfter = row.insertCell(-1);

    let selectList = document.createElement("select");
    selectList.id = GRADES[index];
    selectList.onchange = onchangeSelect;

    gradeBefore.innerHTML = GRADES[index];
    gradeAfter.appendChild(selectList);

    let originIndex = GRADES.indexOf(grade);
    if (originIndex > index) {
      selectList.style.backgroundColor = "#558855";
    } else if (originIndex < index) {
      selectList.style.backgroundColor = "#994444";
    }

    GRADES.forEach((optionGrade) => {
      let option = document.createElement("option");
      option.text = optionGrade;
      option.value = optionGrade;
      option.selected = optionGrade == grade;
      selectList.appendChild(option);
    });
  });
}

function onchangeSelect() {
  chrome.storage.local.get({"grades": GRADES}, (items) => {
    let grades = items["grades"];
    grades[GRADES.indexOf(this.id)] = this.value;
    chrome.storage.local.set({"grades": grades}, () => {
      location.reload();
    });
  });
}
