var $ilavsk = {
  jLevel: {
    arrLevels: [
      "J1A",
      "J1B",
      "J2A",
      "J2B",
      "J3A",
      "J3B",
      "J4A",
      "J4B",
      "J5A",
      "J5B",
      "J6A",
      "J6B",
      "J7A",
      "J7B",
      "J8A",
    ],
    hours: 66,
  },
  sLevel: {
    arrLevels: [
      "S1A",
      "S1B",
      "S2A",
      "S2B",
      "S3A",
      "S3B",
      "S4A",
      "S4B",
      "S5A",
      "S5B",
      "S5C",
      "S6A",
      "S6B",
      "S6C",
      "S7A",
      "S7B",
      "S7C",
    ],
    hours: 60,
  },
  result: {
    desiredOutcome: null,
    allLevels: [],
    arrCourseInfo: [], // { courseStartDate, courseEndDate, courseOutcomes??, ???}
    cumulativeHrs: null,
    startDate: null,
    endDate: null,
    totalDays: null,
    totalWeeks: null,
    totalMonths: null,
    totalYears: null,
    currentAge: null,
    finalAge: null,
    currentGrade: null,
    finalGrade: null,
  },
};

function getSummaryData(objForm) {
  let arrAllLevels = $ilavsk.result.allLevels;

  $ilavsk.result.startDate = objForm.startDate;
  $ilavsk.result.currentGrade = objForm.grade;
  $ilavsk.result.desiredOutcome = objForm.desiredOutcome;

  ///// get days, months, years
  $ilavsk.result.cumulativeHrs =
    arrAllLevels.length * $ilavsk[objForm.program].hours;
  $ilavsk.result.totalWeeks = $ilavsk.result.cumulativeHrs / 4;
  $ilavsk.result.totalMonths = $ilavsk.result.totalWeeks / (52 / 12);
  $ilavsk.result.totalYears = $ilavsk.result.totalMonths / 12;

  let startMoment = moment($ilavsk.startDate);
  let objTimes = decimalDateToJsDate($ilavsk.result.totalYears);
  $ilavsk.result.endDate = startMoment
    .add({
      days: objTimes.days,
      months: objTimes.months,
      years: objTimes.years,
    }).toDate();

  /////// update Summary
  let elSummaryDesiredLevel = document.getElementById("summary-desired-level").innerText = $ilavsk.result.desiredOutcome;
  let strYrs = objTimes.years === 1 ? "year" : "years";
  let strMths = objTimes.months === 1 ? "month" : "months";
  let strDays = objTimes.days === 1 ? "day" : "days";
  let strSummaryDuration = `${objTimes.years} ${strYrs}, ${objTimes.months} ${strMths}, and ${objTimes.days} ${strDays}`;  
  
  document.getElementById("summary-duration").innerText = strSummaryDuration;
  //document.getElementById("summary-endDate").innerText = moment($ilavsk.result.endDate).format("DD/MM/YYYY");


  

  ///show summary
  let elSummaryContainer = document.getElementsByClassName("summary-container")[0];
  elSummaryContainer.style.visibility = "visible";
}

function updatePathway(objForm) {
  let elBlocks = document.getElementsByClassName("block");
  let arrBlocks = Array.from(elBlocks);
  reset(arrBlocks);

  for (let i = objForm.startIndex; i <= objForm.endIndex; i++) {
    $ilavsk.result.allLevels.push($ilavsk[objForm.program].arrLevels[i]);
    arrBlocks[i].classList.add("inPathway");
  }

  getSummaryData(objForm);
}

function getPathway() {
  let objForm = {
    entryLevel: null,
    desiredLevel: null,
    program: null,
    startIndex: null,
    endIndex: null,
    grade: null,
    startDate: null,
    desiredOutcome: null
  };

  objForm.entryLevel = document.getElementById("entryLevel").value;
  let elDesOutcome = document.getElementById("desiredOutcome");
  objForm.desiredLevel = elDesOutcome.value;
  objForm.grade = document.getElementById("grade").value;
  objForm.startDate = new Date(document.getElementById("startDate").value);
  objForm.desiredOutcome = elDesOutcome.options[elDesOutcome.selectedIndex].text;

  ////// TO DO: determine the level based on grade
  objForm.program = "jLevel";

  objForm.startIndex = $ilavsk[objForm.program].arrLevels.indexOf(
    objForm.entryLevel
  );
  objForm.endIndex = $ilavsk[objForm.program].arrLevels.indexOf(
    objForm.desiredLevel
  );

  if (
    objForm.entryLevel.length > 0 &&
    objForm.desiredLevel.length > 0 &&
    objForm.startIndex < objForm.endIndex
  ) {
    updatePathway(objForm);
  } else {
    console.log("error: invalid level(s)");
  }
}

function reset(arrBlocks) {
  arrBlocks.forEach((block) => {
    block.classList.remove("inPathway");
  });

  $ilavsk.result = {
    allLevels: [],
    arrCourseInfo: [],
    cumulativeHrs: null,
    startDate: null,
    endDate: null,
    totalMonths: null,
    totalYears: null,
    currentAge: null,
    finalAge: null,
  };
}

window.addEventListener("DOMContentLoaded", (event) => {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
  var elems = document.querySelectorAll(".datepicker");
  let optionsDatePicker = { autoClose: true };
  var instances = M.Datepicker.init(elems, optionsDatePicker);
});

/**********************************************************************************/
/********                     HELPER FUNCTIONS                                 ****/
/**********************************************************************************/

function decimalDateToJsDate(time) {
  var year = Math.floor(time);
  var thisYear = new Date(year, 0, 1);
  var nextYear = new Date(year + 1, 0, 1);
  var millisecondsInYear = nextYear.getTime() - thisYear.getTime();
  var deltaTime = Math.ceil((time - year) * millisecondsInYear);
  thisYear.setMilliseconds(deltaTime);

  return {
    years: thisYear.getYear(),
    months: thisYear.getMonth(),
    days: thisYear.getDate(),
    thisYear: thisYear,
  };
}

function testMoment() {
  let bday = new Date("June 05, 1974 03:24:00");
  let bdayMoment = moment(bday);
  let newDate = bdayMoment.add({
    days: 10,
    months: 3,
  }).toDate();
  console.log(newDate);
  console.log(newDate.getMonth());
}

testMoment();
