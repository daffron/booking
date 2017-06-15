import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

BigCalendar.momentLocalizer(moment)
const events = [
  {
    'title': 'All Day Event',
    'allDay': true,
    'start': new Date(2015, 3, 0),
    'end': new Date(2015, 3, 1)
  },
  {
    'title': 'Long Event',
    'start': new Date(2015, 3, 7),
    'end': new Date(2015, 3, 10)
  },

  {
    'title': 'DTS STARTS',
    'start': new Date(2016, 2, 13, 0, 0, 0),
    'end': new Date(2016, 2, 20, 0, 0, 0)
  },

  {
    'title': 'DTS ENDS',
    'start': new Date(2016, 10, 6, 0, 0, 0),
    'end': new Date(2016, 10, 13, 0, 0, 0)
  },

  {
    'title': 'Some Event',
    'start': new Date(2015, 3, 9, 0, 0, 0),
    'end': new Date(2015, 3, 9, 0, 0, 0)
  },
  {
    'title': 'Conference',
    'start': new Date(2015, 3, 11),
    'end': new Date(2015, 3, 13),
    desc: 'Big conference for important people'
  },
  {
    'title': 'Meeting',
    'start': new Date(2015, 3, 12, 10, 30, 0, 0),
    'end': new Date(2015, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting'
  },
  {
    'title': 'Lunch',
    'start': new Date(2015, 3, 12, 12, 0, 0, 0),
    'end': new Date(2015, 3, 12, 13, 0, 0, 0),
    desc: 'Power lunch'
  },
  {
    'title': 'Meeting',
    'start': new Date(2015, 3, 12, 14, 0, 0, 0),
    'end': new Date(2015, 3, 12, 15, 0, 0, 0)
  },
  {
    'title': 'Happy Hour',
    'start': new Date(2015, 3, 12, 17, 0, 0, 0),
    'end': new Date(2015, 3, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day'
  },
  {
    'title': 'Dinner',
    'start': new Date(2015, 3, 12, 20, 0, 0, 0),
    'end': new Date(2015, 3, 12, 21, 0, 0, 0)
  },
  {
    'title': 'Birthday Party',
    'start': new Date(2015, 3, 13, 7, 0, 0),
    'end': new Date(2015, 3, 13, 10, 30, 0)
  }
]

class Calendar extends React.Component {
  render () {
    return (
      <div>
        <h3 className='callout'>
          Click an event to see more info, or
          drag the mouse over the calendar to select a date/time range.
        </h3>
        <BigCalendar
          className='calendar'
          selectable
          events={events}
          defaultView='week'
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={slotInfo => {
            showSlotSelection(slotInfo)
            const chosenSlots = takeSlotSelection(slotInfo)
            const takenSlots = mapTakenSlots()
            // console.log('You chose: ' + chosenSlots)
            // console.log('Already taken: ' + takenSlots)
            // console.log(compareSlotSelection(slotInfo))
            console.log(compareSlotSelection(chosenSlots, takenSlots))
          }}
        />
      </div>
    )
  }
}

function showSlotSelection (slotInfo) {
  alert(`selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` + `\nend: ${slotInfo.end.toLocaleString()}`)
}

function compareSlotSelection (chosenSlots, takenSlots) {
  for (let i = 0; i < chosenSlots.length - 1; i++) {
    for (let j = 0; j < takenSlots.length; j++) {
      for (let k = 0; k < takenSlots[j].length - 1; k++) {
        if (chosenSlots[i] === takenSlots[j][k]) {
          return true
        }
      }
    }
  }
}

function startPointEventsForTaken () {
  startPointsEvents.map(obj => {
    return obj.start
  })
}

function takeSlotSelection (slotInfo) {
  let slotArr = slotInfo.slots.map(slot => {
    return moment(slot).format('YYYY-MM-DD hh:mm')
  })
  return slotArr
}

function mapTakenSlots () {
  let slotArr = events.map(obj => {
    return intervals(obj.start, obj.end)
  })
  return slotArr
}

function intervals (startTime, endTime) {
  const start = moment(startTime, 'YYYY-MM-DD hh:mm')
  const end = moment(endTime, 'YYYY-MM-DD hh:mm')

  // round starting minutes up to nearest 30 (26 --> 30, 32 --> 60)
  // note that 59 will round up to 60, and moment.js handles that correctly
  start.minutes(Math.ceil(start.minutes() / 30) * 30)

  const result = []

  const current = moment(start)

  while (current <= end) {
    result.push(current.format('YYYY-MM-DD HH:mm'))
    current.add(30, 'minutes')
  }

  return result
}

export default Calendar
