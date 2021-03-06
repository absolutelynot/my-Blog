function Calendar() {
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    this.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
}
function _parseDate(t) {
    var e = t.split("-");
    return {
        day: parseInt(e[2]),
        month: parseInt(e[1]) - 1,
        year: parseInt(e[0])
    }
}
function _ordinalSuffix(t) {
    var e = ["st", "nd", "rd", "th"];
    if (!(t % 100 < 10 || t % 100 > 13))
        return e[3];
    switch (t % 10) {
    case 1:
        return e[0];
    case 2:
        return e[1];
    case 3:
        return e[2];
    default:
        return e[3]
    }
}
function _formatDate(t) {
    var e = new Date(t.year,t.month,t.day);
    return cal.weekdays[e.getDay()] + " " + t.day + _ordinalSuffix(t.day) + " " + cal.months[t.month] + ", " + t.year
}
function _formatDateInput(t) {
    return t.year + "-" + (t.month + 1) + "-" + (t.day < 10 ? "0" + t.day : t.day)
}
function _isPast(t) {
    var e = {
        day: (new Date).getDate(),
        month: (new Date).getMonth(),
        year: (new Date).getFullYear()
    };
    return new Date(t.year,t.month,t.day).getTime() < new Date(e.year,e.month,e.day).getTime()
}
var cal = new Calendar
  , date = new Date
  , todo = new Vue({
    el: "#app",
    data: {
        weekdayNames: cal.weekdays.map(function(t) {
            return t.slice(0, 3)
        }),
        monthNames: cal.months,
        currentYear: date.getFullYear(),
        currentMonth: date.getMonth(),
        today: date.getDate(),
        todayObj: {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear()
        },
        activeYear: date.getFullYear(),
        activeMonth: date.getMonth(),
        currentList: [],
        database: !1,
        taskList: [],
        state: "split",
        taskOpen: !1,
        loaded: !1,
        newTask: !1,
        enteredTask: "",
        enteredDate: "",
        sidebar: !1,
        selected: {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear()
        }
    },
    created: function() {
        this.activeMonth = this.currentMonth,
        this.enteredDate = _formatDateInput(this.todayObj),
        this.getListDB(),
        localStorage.getItem("savedState") && (this.state = localStorage.getItem("savedState"),
        console.log("STATE LOADED"))
    },
    watch: {
        selected: {
            handler: function() {
                var t = this;
                this.enteredDate = _formatDateInput(this.selected),
                t.currentList = this.taskList.filter(function(e) {
                    return _parseDate(e.date).day === t.selected.day && _parseDate(e.date).month === t.selected.month && _parseDate(e.date).year === t.selected.year
                })
            },
            deep: !0
        },
        taskList: {
            handler: function() {
                var t = this;
                t.currentList = this.taskList.filter(function(e) {
                    return _parseDate(e.date).day === t.selected.day && _parseDate(e.date).month === t.selected.month && _parseDate(e.date).year === t.selected.year
                })
            },
            deep: !0
        },
        state: {
            handler: function() {
                localStorage.setItem("savedState", this.state),
                console.log("STATE SAVED")
            },
            deep: !0
        }
    },
    computed: {
        getWeeks: function() {
            for (var t = [], e = new Date(this.activeYear,this.activeMonth,1).getDay(), a = new Date(this.activeYear,this.activeMonth + 1,0).getDate(), s = 1, n = 0; n < 6 && s < a + 1; n++)
                if (t.push([]),
                0 === n)
                    for (var i = 0; i < 7; i++)
                        if (i < e)
                            t[n].push("");
                        else {
                            t[n].push({
                                day: s,
                                month: this.activeMonth,
                                year: this.activeYear
                            });
                            (r = t[n][t[n].length - 1]).todos = this.getTodos(r),
                            s++
                        }
                else
                    for (i = 0; i < 7; i++)
                        if (s < a + 1) {
                            t[n].push({
                                day: s,
                                month: this.activeMonth,
                                year: this.activeYear
                            });
                            var r;
                            (r = t[n][t[n].length - 1]).todos = this.getTodos(r),
                            s++
                        } else
                            t[n].push("");
            return t
        }
    },
    methods: {
        addNewTask: function() {
            this.newTask = !0,
            this.sidebar && (this.sidebar = !1)
        },
        removeTask: function(t) {
            var e = this.taskList.indexOf(t);
            this.taskList.splice(e, 1)
        },
        getListDB: function() {
            var t = this
              , e = new XMLHttpRequest;
            e.open("GET", "todolist.php", !0),
            console.log("GET LIST"),
            e.onreadystatechange = function() {
                4 == this.readyState && 200 == this.status ? (t.taskList = JSON.parse(this.response),
                t.loaded = !0,
                console.log("GOT LIST"),
                t.database = !0) : (console.log("Database List Not Found"),
                t.database = !1,
                t.loaded = !0)
            }
            ,
            e.send()
        },
        saveListDB: function() {
            var t = new XMLHttpRequest;
            t.onreadystatechange = function() {
                4 == this.readyState && 200 == this.status && ("SUCCESS" === this.response ? alert("Task List Saved") : alert(this.response))
            }
            ,
            console.log(JSON.stringify(this.taskList)),
            t.open("POST", "savelist.php", !0),
            t.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
            t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
            t.send("data=" + JSON.stringify(this.taskList))
        },
        addTask: function() {
            var t = this.enteredTask.trim();
            !1 === _isPast(_parseDate(this.enteredDate)) ? t && (this.taskList.push({
                text: t,
                checked: !1,
                date: this.enteredDate,
                id: Date.now()
            }),
            console.log(this.taskList[this.taskList.length - 1]),
            this.enteredTask = "") : alert("Please pick today or a day in the future.")
        },
        isPast: function(t) {
            return new Date(t.year,t.month,t.day).getTime() < new Date(this.currentYear,this.currentMonth,this.today).getTime()
        },
        isState: function(t) {
            return this.state === t
        },
        closeModal: function() {
            this.taskOpen && (this.taskOpen = !1),
            this.newTask && (this.newTask = !1)
        },
        closeSidebar: function() {
            this.sidebar && (this.sidebar = !1)
        },
        toggleSidebar: function() {
            this.sidebar = !0 !== this.sidebar
        },
        toggleState: function() {
            this.state = "split" === this.state ? "full" : "split"
        },
        getTodos: function(t) {
            return this.taskList.filter(function(e) {
                return _parseDate(e.date).day === t.day && _parseDate(e.date).month === t.month && _parseDate(e.date).year === t.year
            })
        },
        selectDay: function(t) {
            t > 0 && (this.selected.day = t,
            this.selected.month = this.activeMonth,
            this.selected.year = this.activeYear)
        },
        deselect: function() {
            for (var t in this.selected)
                this.selected[t] = !1
        },
        isToday: function(t) {
            return this.today === t && this.activeMonth === this.currentMonth && this.activeYear === this.currentYear
        },
        isSelected: function(t) {
            return this.selected.day === t && this.activeMonth === this.selected.month && this.activeYear === this.selected.year
        },
        formatDate: function(t) {
            return _formatDate(t)
        },
        prevMonth: function() {
            0 === this.activeMonth ? (this.activeMonth = 11,
            this.activeYear--) : this.activeMonth--
        },
        nextMonth: function() {
            11 === this.activeMonth ? (this.activeMonth = 0,
            this.activeYear++) : this.activeMonth++
        },
        prevYear: function() {
            this.activeYear--
        },
        nextYear: function() {
            this.activeYear++
        }
    }
});