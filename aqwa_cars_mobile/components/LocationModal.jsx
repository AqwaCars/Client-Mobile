import React from "react";
import { StyleSheet, View, Text } from "react-native";
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      displayedDate: moment(),
    };
  }

  componentDidMount() {
    this.openDateRangePicker();
  }

  openDateRangePicker = () => {
    // Simulating user selection of date range
    const today = moment();
    const startDate = today.clone().subtract(7, 'days');
    const endDate = today.clone().subtract(1, 'days');

    // Setting the selected date range in state
    this.setState({
      startDate,
      endDate,
    }, () => {
      console.log("State updated:", this.state);
      this.logDates(this.state.startDate, this.state.endDate);
    });
  };

  logDates = (startDate, endDate) => {
    if (startDate && endDate) {
      let currentDate = moment(startDate);
      const datesBetween = [];
      while (currentDate <= endDate) {
        datesBetween.push(currentDate.format("YYYY-MM-DD"));
        currentDate = moment(currentDate).add(1, "days");
      }
      console.log("Dates between:", datesBetween);
    }
  };

  render() {
    const { startDate, endDate, displayedDate } = this.state;
    return (
      <View style={styles.container}>
        <DateRangePicker
          onChange={this.setDates}
          endDate={endDate}
          startDate={startDate}
          displayedDate={displayedDate}
          range
          showPicker
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
