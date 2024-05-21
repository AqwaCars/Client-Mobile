import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const RangeCalendar = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  const handleDayPress = (day) => {
    if (!startDate || (day.dateString < startDate && !endDate)) {
      setStartDate(day.dateString);
      setEndDate('');
      setMarkedDates({ [day.dateString]: { selected: true, startingDay: true } });
    } else if (startDate && !endDate && day.dateString >= startDate) {
      setEndDate(day.dateString);
      const datesInRange = getDatesInRange(startDate, day.dateString);
      const marked = { ...markedDates };
      datesInRange.forEach((date, index) => {
        marked[date] = { selected: true, endingDay: index === datesInRange.length - 1 };
      });
      setMarkedDates(marked);
    } else {
      setStartDate(day.dateString);
      setEndDate('');
      const marked = { [day.dateString]: { selected: true, startingDay: true } };
      setMarkedDates(marked);
    }
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    while (currentDate <= new Date(end)) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const handleShowDates = () => {
    console.log('Selected Dates:', getDatesInRange(startDate, endDate));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Start Date and End Date:</Text>
      <Calendar
        current={new Date()}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />
      <Button
        title="Show Dates"
        onPress={handleShowDates}
        disabled={!startDate || !endDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RangeCalendar;
