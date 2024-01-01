import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";


export default function Charts({ lmApiKey }: { lmApiKey: string }) {
  const [transactions, setTransactions] = useState([]);

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.headerTextBold}>Not implemented.</Text>
    </View>
  )
}