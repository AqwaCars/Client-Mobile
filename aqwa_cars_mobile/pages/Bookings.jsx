import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getallCarByAgency, deletedAgencyCar } from "../store/carFetch.js";
import { selectUser } from "../store/userSlice";

import car2 from "../assets/car2.png";
import star from "../assets/star.jpg";
import deleteImge from "../assets/delete.jpg";

function Bookings() {
  const dispatch = useDispatch();
  const activeUser = useSelector(selectUser);
  const allCarsByAgency = useSelector((state) => state.car.agencyCar);
  const loading = useSelector((state) => state.car.loading);
  useEffect(() => {
    activeUser.Agency
      ? dispatch(getallCarByAgency(activeUser.Agency.id))
      : null;
  }, [dispatch]);
  const handleDeled = (car) => {
    deletedAgencyCar(activeUser.id, car);
  };


 
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 10, flexGrow: 1 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.favouriteText}>All Cars</Text>
        </View>
        {loading ? (
          activeUser.type === "agency" ? (
            allCarsByAgency?.map((OneCar, i) => (
              <View key={i} style={styles.carCard}>
                <View style={styles.items}>
                  <View style={styles.deleted2}>
                    <TouchableOpacity onPress={handleDeled(OneCar.car.id)}>
                      <Image style={styles.delete} source={deleteImge} />
                    </TouchableOpacity>
                  </View>
                  <Image
                    style={styles.car}
                    source={{ uri: OneCar.carImage.media }}
                  />
                  <View style={styles.detail}>
                    <Text style={styles.title}>{OneCar.car.model}</Text>
                    <View style={styles.stars}>
                      <Image style={styles.star} source={star} />
                      <Image style={styles.star} source={star} />
                      <Image style={styles.star} source={star} />
                      <Image style={styles.star} source={star} />
                      <Image style={styles.star} source={star} />
                    </View>
                    <Text style={styles.agencyName}>{OneCar.car.status}</Text>
                    <Text style={styles.price}>
                      ${OneCar.car.price}/{OneCar.car.period}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.carCard}>
              <View style={styles.items}>
                <View style={styles.deleted2}>
                  <TouchableOpacity>
                    <Image style={styles.delete} source={deleteImge} />
                  </TouchableOpacity>
                </View>
                <Image style={styles.car} source={car2} />
                <View style={styles.detail}>
                  <Text style={styles.title}>clio</Text>
                  <View style={styles.stars}>
                    <Image style={styles.star} source={star} />
                    <Image style={styles.star} source={star} />
                    <Image style={styles.star} source={star} />
                    <Image style={styles.star} source={star} />
                    <Image style={styles.star} source={star} />
                  </View>
                  <Text style={styles.agencyName}>rent</Text>
                  <Text style={styles.price}>$220 / daily</Text>
                </View>
              </View>
            </View>
          )
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 7,
    marginVertical: 7,
    // marginTop: "12%",
    flexDirection: "column",
    gap: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteCar: {
    marginBottom: 10,
  },
  carImage: {
    width: 100,
    height: 100,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "rgb(219, 217, 224)",
  },
  heart: {
    width: 60,
    height: 55,
  },
  message: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    paddingTop: 180,
    gap: 20,
  },

  emptyText1: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",

    color: "rgb(219, 217, 224)",
  },
  favouriteText: {
    color: "black",
    width: 500,
    fontWeight: "bold",
    borderBottomWidth: 0.5,

    borderBottomColor: "black",
    fontSize: 18,
  },
  carCard: {
    marginTop: "7%",
    borderColor: "grey",
    borderWidth: 2,
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  car: {
    width: 180,
    height: 120,

    borderRadius: 7,
  },
  star: {
    width: 15,
    height: 15,
  },
  items: {
    flexDirection: "row",
  },
  stars: {
    flexDirection: "row",
    gap: 3,
  },
  detail: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",

    width: 140,
    gap: 7,
    padding: 8,
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  agencyName: {
    color: "lightgrey",
    fontSize: 14,
  },
  price: {
    color: "blue",
  },
  delete: {
    justifyContent: "flex-end",
    width: 20,
    height: 20,
  },

  deleted2: {
    width: 320,
    height: 10,
    position: "absolute",
    alignItems: "flex-end",
  },
});

export default Bookings;
