
//
// MMM-Timetable by eouia and modified by bugsounet
//


var convertTime = function(num) {
  var rnum = Number(num)
  var m = rnum % 100
  var h = (rnum - m) / 100
  return (h * 60) + m
}

var timeFormat = function(str, format) {
  return moment(str, "HHmm").format(format)
}

Module.register("MMM-Timetable", {
  defaults: {
    //noscheduleMessage: "No schedule today", //reserved for next revision
    timeFormat: "hh:mm A",
    height: "700px",
    width: "150px",
    mode: "5days", // "today", "5days", "7days"
    refreshInterval: 1000*10,
    displayEndTime: false,
    displayPeriod: true,
    title: null,
    schedules: [ //array of schedules
      {
        title: "Slytherin 2nd Year",
        file_W1:null, // csv semaine pair
	file_W2:null, // csv semaine impair
        schedule: [
          // [weekday, starttime(24h), endtime(24h), title, subtitle, backgroundColor(optional)]
          // weekday : 1 for Monday, 2 for Tuesday, ... 7 for Sunday
          [1, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [2, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [3, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [4, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [5, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [1, "1200", "1300", "Lunch", "", "rgba(0,255,0, 0.5)"],
          [2, "1200", "1220", "Lunch", "", "rgba(0,255,0, 0.5)"],
          [2, "1243", "1245", "Lunch", "", "rgba(0,255,0, 0.5)"],
          [3, "1200", "1300", "Lunch", "", "rgba(0,255,0, 0.5)"],
          [4, "1200", "1300", "Lunch", "", "rgba(0,255,0, 0.5)"],
          [5, "1200", "1300", "Lunch", "", "rgba(0,255,0, 0.5)"],
          [1, "1800", "1900", "Dinner", "", "rgba(0,255,0, 0.5)"],
          [2, "1800", "1900", "Dinner", "", "rgba(0,255,0, 0.5)"],
          [3, "1800", "1900", "Dinner", "", "rgba(0,255,0, 0.5)"],
          [4, "1800", "1900", "Dinner", "", "rgba(0,255,0, 0.5)"],
          [5, "1800", "1900", "Dinner", "", "rgba(0,255,0, 0.5)"],
          [1, "1100", "1145", "Transfiguration", "w/Ravenclaw"],
          [1, "1315", "1400", "Charms", "w/Hufflepuff"],
          [2, "0915", "1045", "Transfiguration", "w/Ravenclaw"],
          [2, "1500", "1630", "Herbology", "w/Ravenclaw"],
          [3, "0915", "1045", "Defense Against The Dark Art", "w/Gryffindor", "rgba(255,0,0,0.5)"],
          [3, "1100", "1145", "Charms", "w/Hufflepuff"],
          [3, "1315", "1445", "History of Magic", "w/Hufflepuff"],
          [3, "1500", "1630", "Potions", "w/Gryffindor"],
          [4, "1100", "1145", "Defense Against The Dark Art", "w/Gryffindor"],
          [5, "1315", "1400", "Potions", "w/Gryffindor"],
        ]
      },

    ]
  },

  getStyles: function() {
    return ["MMM-Timetable.css"]
  },

  getScripts: function() {
    return ["moment.js"]
  },

  getDom: function() {
    var schedule = this.config.schedules[this.index]

    var container = document.createElement("div")
    container.id = "TTABLE_CONTAINER"
    if (this.config.schedules.length > 1) {
      container.className = "multi"
    }

    var title = document.createElement("div")
    title.id = "TTABLE_TITLE"
    container.appendChild(title)


    var wrapper = document.createElement("div")
    wrapper.id = "TTABLE"

    var tlCol = document.createElement("div")
    var empty = document.createElement("div")
    empty.id = "TTABLE_TIME_HEADER"
    empty.className = "header"
    tlCol.appendChild(empty)

    var timeline = document.createElement("div")
    timeline.id = "TTABLE_TIMELINE"
    timeline.className = "column"
    timeline.style.height = this.config.height
    tlCol.appendChild(timeline)
    wrapper.appendChild(tlCol)
    for (i = 1; i <= 7; i++) {
      var dayCol = document.createElement("div")
      dayCol.id = "TTABLE_DAYCOLUMN_" + i
      var dayHeader = document.createElement("div")
      dayHeader.id = "TTABLE_DAY_HEADER_" + i
      dayHeader.className = "header"
      dayHeader.innerHTML = moment().isoWeekday(i).format("ddd")
      var day = document.createElement("div")
      day.id = "TTABLE_DAY_" + i
      day.className = "column day"
      day.style.width = this.config.width
      dayCol.appendChild(dayHeader)
      dayCol.appendChild(day)
      wrapper.appendChild(dayCol)
    }


    container.appendChild(wrapper)
    return container
  },

  start: function() {
    this.index = 0
    this.today = 0
  },

  notificationReceived: function(noti, payload, sender) {
    if (noti == "DOM_OBJECTS_CREATED") {
      this.draw()
    }
    if(noti == "TIMETABLE_CALL") {
	this.draw(payload)
    }
  },

  draw: function(payload) {
    this.today = moment().isoWeekday();
    if (payload) { // si payload ...
	for (var i = 0; i < this.config.schedules.length; i++) { // boucle sur tous les schedules
		if (this.config.schedules[i].title == payload) { // recherche match sur le payload
			this.index = i; // mise a jour de l'index
		}
	 }
    }
    this.drawView(this.config.schedules[this.index]) // affiche le schedule
    console.log("[MMM-TT] Display TimeTable : " + this.config.schedules[this.index].title);
    this.index++; // index +1 for Timer
    if (this.index >= this.config.schedules.length) { // if every schedules was read -> return to the first
	this.index = 0
    }
    if (this.config.refreshInterval !=0) this.resetTimer();
  },

  resetTimer: function() {
	var self = this;
	clearInterval(self.interval);
	self.counter = this.config.refreshInterval;

	self.interval = setInterval(function() {
		self.counter -=1000;
		if (self.counter <= 0) {
			clearInterval(self.interval);
			self.draw();
		}
	},1000);
  },

  drawSchedule: function(schedule) {
    var now = moment();
    var noWeek = now.week();
    var fullTitle;
    if (this.config.mode == '5days' && this.today > 5) noWeek++; // announces next week's schedule
    if (this.config.title) fullTitle = this.config.title + " " + noWeek + " - " + schedule.title // personalized title
    else fullTitle = schedule.title; // eouia Default

    document.getElementById("TTABLE_TITLE").innerHTML = fullTitle;
    var dayFilter = {
      "today" : [this.today],
      "5days" : [1,2,3,4,5],
      "7days" : [1,2,3,4,5,6,7]
    }
    var filter = dayFilter[this.config.mode]
    for(i=1; i<=7; i++) {
      var prev = document.getElementById("TTABLE_DAY_" + i)
      if (typeof prev !== "undefined") {
        prev.innerHTML = ""
      }
      var elm = document.getElementById("TTABLE_DAYCOLUMN_" + i)
      if (filter.includes(i)) {
        elm.className = "show"
      } else {
        elm.className = "hide"
      }
    }

    var tline = document.getElementById("TTABLE_TIMELINE")
    tline.innerHTML = ""

    var oHeight = document.getElementById("TTABLE_TIMELINE").offsetHeight
    var validItem = {}
    var tlItem = new Set()
    var maxTl = null

    for(var i in schedule.schedule) {
      var item = schedule.schedule[i]
      if (maxTl <= item[2]) {
        maxTl = item[2]
      }
      if (this.config.mode == 'today') {
        if (item[0] == this.today || item[0] == 0) {
          if(typeof validItem[item[0]] == "undefined") {
            validItem[item[0]] = []
          }
          validItem[item[0]].push(item)
          tlItem.add(item[1])
          if (this.config.displayEndTime) {
            tlItem.add(item[2])
          }
        }
      } else if (this.config.mode == '5days') {
        if (item[0] <= 5) {
          if(typeof validItem[item[0]] == "undefined") {
            validItem[item[0]] = []
          }
          validItem[item[0]].push(item)
          tlItem.add(item[1])
          if (this.config.displayEndTime) {
            tlItem.add(item[2])
          }
        }
      } else {
        if(typeof validItem[item[0]] == "undefined") {
          validItem[item[0]] = []
        }
        validItem[item[0]].push(item)
        tlItem.add(item[1])
        if (this.config.displayEndTime) {
          tlItem.add(item[2])
        }
      }
    }
    tlItem.add(maxTl)
    var tl = Array.from(tlItem).sort()
    var start = convertTime(tl.shift())
    var end = convertTime(tl.pop())
    var duration = end - start


    var now = convertTime(moment().format("HHmm"))
    if (start < now && now < end) {
      var elm = document.createElement("div")
      var pos = Math.floor((now - start) / duration * oHeight)
      elm.className = "now now_" + now
      elm.style.top = pos + "px"
      tline.appendChild(elm)
    }

    tl = Array.from(tlItem).sort()
    for(var j in tl) {
      var item = tl[j]
      var pos = Math.floor((convertTime(item) - start) / duration * oHeight)
      var elm = document.createElement("div")
      elm.id = "time_" + item
      elm.className = "time"
      elm.innerHTML = timeFormat(item, this.config.timeFormat)
      elm.style.top = pos + "px"
      tline.appendChild(elm)
    }

    for(var i in validItem) {
      var day = document.getElementById("TTABLE_DAY_" + i)
      day.className = "column"
      if (i == this.today) {
        day.className += " today"
      }
      day.innerHTML = ""
      var items = validItem[i]
      for (var j in items) {
        var item = items[j]
        var startTime = convertTime(item[1])
        var endTime = convertTime(item[2])
        var height = Math.floor((endTime - startTime) / duration * oHeight)
        var startPos = Math.floor((startTime - start) / duration * oHeight)
        var isNow = false
        if (this.today == i && startTime <= now && now <= endTime) {
          isNow = true
        }

        var elm = document.createElement("div")
        elm.className = "item"
        elm.className += (isNow) ? " isnow" : ""
        elm.style.top = startPos + "px"
        elm.style.height = height + "px"
        elm.style.width = this.config.width
        elm.id = "ITEM_" + item[0] + "_" + item[1] + "_" + item[2]
        if (typeof item[5] !== undefined) {
          elm.style.backgroundColor = item[5]
        }
        var title = document.createElement("p")
        title.className = "title"
        title.innerHTML = item[3]
        var subtitle = document.createElement("p")
        subtitle.className = "subtitle"
        subtitle.innerHTML = item[4]
        var period = document.createElement("p")
	if (this.config.displayPeriod) {
        	period.className = "period"
        	period.innerHTML = timeFormat(item[1], this.config.timeFormat) + " - " + timeFormat(item[2], this.config.timeFormat)
        	elm.appendChild(title)
        	elm.appendChild(period)
	} else {
		elm.appendChild(title)
	}
        elm.appendChild(subtitle)
        day.appendChild(elm)
      }
    }

  },

  drawView: function(schedule) {
    var draw = (schedule)=> {
      if (this.config.schedules.length > 1) {
        document.getElementById("TTABLE_CONTAINER").style.opacity = 0
        var timer = setTimeout(()=>{
          this.drawSchedule(schedule)
          document.getElementById("TTABLE_CONTAINER").style.opacity = 1
        }, 2000)
      } else {
        this.drawSchedule(schedule)
      }
    }
    if (schedule.file_W1) {
	var now = moment();
	var noWeek = now.week();

	if (this.config.mode == '5days' && this.today > 5) noWeek++;

	if(schedule.file_W2 && this.Impair(noWeek)) {
		//console.log("INFO : Semaine impair -- " + noWeek);
		this.readCSV(schedule.file_W2, schedule, draw)
    	} else {
		//console.log("INFO : Semaine pair -- " + noWeek);
		this.readCSV(schedule.file_W1, schedule, draw)
    	}
    } else {
      draw(schedule)
    }
  },

  Impair : function (semaine){
	semaine=parseInt(semaine);
	return ((semaine & 1)=='0')?false:true;
  },

  readCSV: function (file, schedule, callback) {
    var url = "/modules/MMM-Timetable/" + file
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = () => {
      var res = []
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var lines = xmlHttp.responseText.split(/[\r\n]+/)
        if (lines.length > 0) {
          for(var i = 0; i < lines.length; i++) {
            var line = lines[i]
            if (line != "") {
              var a = this.CSVToArray(line, ",")
              res.push(a[0])
            }
          }
          schedule.schedule = res
          callback(schedule)
        }
      }
    }
    xmlHttp.open("GET", url, true)
    xmlHttp.send(null)
  },

  //Thanks to https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
  CSVToArray: function (strData, strDelimiter){
    strDelimiter = (strDelimiter || ",")
    var objPattern = new RegExp(
      (
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
      )
    var arrData = [[]]
    var arrMatches = null
    while (arrMatches = objPattern.exec( strData )){
      var strMatchedDelimiter = arrMatches[ 1 ]
      if (
        strMatchedDelimiter.length &&
        (strMatchedDelimiter != strDelimiter)
        ){
        arrData.push( [] )
      }
      if (arrMatches[ 2 ]){
        var strMatchedValue = arrMatches[ 2 ].replace(
          new RegExp( "\"\"", "g" ),
          "\""
          )
      } else {
        var strMatchedValue = arrMatches[ 3 ]
      }
      arrData[ arrData.length - 1 ].push( strMatchedValue )
    }
    return( arrData )
  }
})
