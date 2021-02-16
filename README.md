# MMM-Timetable
Display timetable for school or work.

## Screenshot
![screenshot](https://github.com/eouia/MMM-Timetable/blob/master/ttable_1.png?raw=true)

![screenshot](https://github.com/eouia/MMM-Timetable/blob/master/ttable_2.png?raw=true)


## Installation

1. Install Module
```sh
cd ~/MagicMirror/modules
git clone https://github.com/eouia/MMM-Timetable.git
```

2. Configuration
```javascript
{
  //disabled:true,
  module: "MMM-Timetable",
  position: "top_right",
  config: {
    timeFormat: "hh:mm A",
    height: "800px",
    width: "150px",
    mode: "5days", // "today", "5days", "7days"
    refreshInterval: 1000*60,
    displayEndTime:true, //whether display endTime on timeline or not.
    schedules: [ //array of schedules
      {
        title: "Slytherin 2nd Year",
        file: null, // or "test.csv" - comma separated text file. (see `test.csv`)
        schedule: [
          // [weekday, starttime(24h), endtime(24h), title, subtitle, backgroundColor(optional)]
          // weekday : 1 for Monday, 2 for Tuesday, ... 7 for Sunday
          [1, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [2, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [3, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [4, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [5, "0730", "0900", "Breakfast", "", "rgba(0,255,0, 0.5)"],
          [1, "1200", "1300", "Lunch", "", "rgba(0,255,0, 0.5)"],
          [2, "1200", "1300", "Lunch", "", "rgba(0,255,0, 0.5)"],
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
      {
        title: "Slytherin 2nd Year (only classes)",
        schedule: [
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
  }
},

```

3. Warning.
When you use CSV(comma separated), check time format. use "0900" instead "900".

## Support and Helping
Support is now on [the 4th Party Modules Forum](http://forum.bugsounet.fr)
