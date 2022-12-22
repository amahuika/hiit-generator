import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "../components/Card";
import { DatabaseConnection } from "../assets/database/DatabaseConnection";

const db = DatabaseConnection.getConnection();

function CategoryScreen(props) {
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM category", [], (tx, results) => {
        const length = results.rows.length;
        // console.log(length);
        if (length > 0) {
          setCategoryList((prev) => [...results.rows._array]);
        }
      });
    });
  }, []);
  return (
    <View style={styles.container}>
      {categoryList.map((item) => (
        <Card key={item.id}>
          <Text>{item.name}</Text>
        </Card>
      ))}
    </View>
  );
}
export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  text: {
    color: "#EEEEEE",
  },
});
