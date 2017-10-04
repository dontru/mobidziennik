/*
 * 'oceny' AKA 'marks', 'grades'
 */

const GRADES = [
  "1-", "1", "1+", "2-", "2", "2+", "3-", "3", "3+",
  "4-", "4", "4+", "5-", "5", "5+", "6-", "6", "6+"
];

class Grade {
  constructor(parent) { this.parent = parent }

  toValue() {
    let grade = this.get();

    switch (grade) {
      case "np": case "nb": return 0;
      case "BO": return 0.1;
    }

    let integer = new Number(grade.substring(0, 1));
    switch (grade.substring(1, 2)) {
      case "":  return integer;
      case "-": return integer - 0.25;
      case "+": return integer + 0.5;
    }

    return -1;
  }

  static type(grade) {
    if (grade.innerHTML.substring(1, 7) == "strong")
      return "default";
    else
      return "text";
  }
}

class DefaultGrade extends Grade {
  get() { return this.parent.firstChild.innerHTML }

  set(grade) {
    this.parent.firstChild.innerHTML = grade;
    let tooltip = this.parent.lastChild;
    let innerHTML = tooltip.innerHTML;
    let start = innerHTML.indexOf(">") + 1;
    let end = innerHTML.indexOf("</");
    tooltip.innerHTML = [
      tooltip.innerHTML.substring(0, start),
      this.toValue(),
      tooltip.innerHTML.substring(end)
    ].join(" ");
  }
}

class TextGrade extends Grade {
  get() {
    let innerHTML = this.parent.innerHTML;
    let end = innerHTML.indexOf("<");
    let grade = innerHTML.substring(0, end);
    return grade.trim();
  }

  set(grade) {
    let innerHTML = this.parent.innerHTML;
    let end = innerHTML.indexOf("<");
    let str = " ".repeat(24) + grade + " ".repeat(25);
    this.parent.innerHTML = str + innerHTML.substring(end);

    innerHTML = this.parent.innerHTML;
    let start = innerHTML.indexOf("<strong>") + 8;
    end = innerHTML.indexOf("</strong>");
    this.parent.innerHTML = [
      innerHTML.substring(0, start),
      this.toValue(),
      innerHTML.substring(end)
    ].join(" ");
  }
}

function getGrades() {
  let infoElements = document.getElementsByClassName("info");
  let GradeType = Grade.type(infoElements[0]) == "default"
    ? DefaultGrade : TextGrade;

  let grades = [];
  for (let element of infoElements) {
    grades.push(new GradeType(element));
  }

  return grades;
}

chrome.storage.local.get({
  "grades": GRADES
}, (items) => {
  let grades = items["grades"];
  let pattern = {};

  grades.forEach((grade, index) => {
    if (grade != GRADES[index]) {
      pattern[ GRADES[index] ] = grade;
    }
  });

  getGrades().forEach((grade) => {
    let value = grade.get();
    if (value in pattern) {
      grade.set(pattern[value]);
    }
  });
});
