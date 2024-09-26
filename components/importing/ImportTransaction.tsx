import { memo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  AppCategory,
  AppDraftTransaction,
} from '../../models/lunchmoney/appModels';
import { formatAmountString } from '../../data/formatBalance';
import { NewBrandingColours } from '../../styles/brandingConstants';

// TODO: not in use yet
const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
    marginBottom: 4,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  transactionNotes: {
    fontSize: 14,
    color: NewBrandingColours.text.muted,
    marginBottom: 4,
  },

  transactionAmount: {
    marginRight: 16,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: NewBrandingColours.secondary.main,
  },
  negativeAmount: {
    color: NewBrandingColours.accent.red,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NewBrandingColours.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: NewBrandingColours.neutral.gray,
  },

  categoryModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  categoryModalContent: {
    maxHeight: screenHeight * 0.6,
    backgroundColor: NewBrandingColours.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    alignItems: 'stretch',
  },
  categoryModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NewBrandingColours.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NewBrandingColours.neutral.lightGray,
  },
  categoryText: {
    fontSize: 16,
    color: NewBrandingColours.text.primary,
  },
  closeModalButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 18,
    color: NewBrandingColours.primary.main,
    fontWeight: '600',
  },
});

type ImportTransactionProps = {
  transaction: AppDraftTransaction;
  isSelected: boolean;
  onSelect;
  onCategoryChange;
  categories: AppCategory[];
  // updateTransaction: (
  //   transaction: AppDraftTransaction,
  //   selected: boolean,
  // ) => void;
};

const TransactionItem = memo(({
  transaction,
  isSelected,
  onSelect,
  onCategoryChange,
  categories
}: ImportTransactionProps) => {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const parsedAmount = parseFloat(transaction.amount);
  const transactionAmountString = formatAmountString(parsedAmount);

  const handleCategoryChange = (category) => {
    onCategoryChange(transaction, category);
    setCategoryModalVisible(false);
  };

  return (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => onSelect(transaction)}
    >
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
        <Text style={styles.transactionName}>{transaction.payee}</Text>
        {transaction.notes ? (
          <Text style={styles.transactionNotes}>{transaction.notes}</Text>
        ) : null}
        <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
          <Text style={styles.transactionNotes}>
            {transaction.categoryName || 'Uncategorized'}{' '}
            <Icon
              name="chevron-down"
              size={14}
              color={NewBrandingColours.text.muted}
            />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.transactionAmount}>
        <Text
          style={[
            styles.amountText,
            parsedAmount >= 0 ? styles.positiveAmount : styles.negativeAmount,
          ]}
        >
          {transactionAmountString}
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
        {isSelected ? (
          <View style={styles.selectedIcon}>
            <Icon
              name="check"
              size={24}
              color={NewBrandingColours.neutral.white}
            />
          </View>
        ) : (
          <View style={styles.unselectedIcon} />
        )}
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setCategoryModalVisible(false)}
        >
          <View style={styles.categoryModalContainer}>
            <View style={styles.categoryModalContent}>
              <Text style={styles.categoryModalTitle}>Select Category</Text>
              <FlatList
                data={categories}
                renderItem={({ item: category }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => handleCategoryChange(category)}
                  >
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id.toString()}
              />
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </TouchableOpacity>
  );
});

export default TransactionItem;

// export default function ImportTransaction({
//   transaction,
//   categories,
//   updateTransaction,
// }: ImportTransactionProps) {
//   const [categoryModalVisible, setCategoryModalVisible] =
//     useState<boolean>(false);
//   const [selected, setSelected] = useState<boolean>(false);
//   const [categoryChosen, setCategoryChosen] = useState<AppCategory>(null);

//   const parsedAmount: number = parseFloat(transaction.amount);
//   const transactionAmountString = formatAmountString(parsedAmount);

//   const handleTransactionSelection = () => {
//     const newSelected = !selected;
//     setSelected(newSelected);
//     updateTransaction(transaction, newSelected);
//   };

//   const handleCategoryChange = (category: AppCategory) => {
//     setCategoryChosen(category);
//     updateTransaction(
//       {
//         ...transaction,
//         categoryId: category.id,
//         categoryName: category.name,
//       },
//       selected,
//     );
//     setCategoryModalVisible(false);
//   };

//   return (
//     <TouchableOpacity
//       style={styles.transactionItem}
//       onPress={() => handleTransactionSelection()}
//     >
//       <View style={styles.transactionInfo}>
//         <Text style={styles.transactionDate}>{transaction.date}</Text>
//         <Text style={styles.transactionName}>{transaction.payee}</Text>
//         {transaction.notes ? (
//           <Text style={styles.transactionNotes}>{transaction.notes}</Text>
//         ) : null}
//         <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
//           <Text style={styles.transactionNotes}>
//             {categoryChosen?.name || 'Uncategorized'}{' '}
//             <Icon
//               name="chevron-down"
//               size={14}
//               color={NewBrandingColours.text.muted}
//             />
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.transactionAmount}>
//         <Text
//           style={[
//             styles.amountText,
//             parsedAmount >= 0 ? styles.positiveAmount : styles.negativeAmount,
//           ]}
//         >
//           {transactionAmountString}
//         </Text>
//       </View>
//       <View style={styles.checkboxContainer}>
//         {selected ? (
//           <View style={styles.selectedIcon}>
//             <Icon
//               name="check"
//               size={24}
//               color={NewBrandingColours.neutral.white}
//             />
//           </View>
//         ) : (
//           <View style={styles.unselectedIcon} />
//         )}
//       </View>

//       <Modal
//         animationType="slide"
//         transparent
//         visible={categoryModalVisible}
//         onRequestClose={() => setCategoryModalVisible(false)}
//       >
//         <TouchableWithoutFeedback
//           onPress={() => setCategoryModalVisible(false)}
//         >
//           <View style={styles.categoryModalContainer}>
//             <View style={styles.categoryModalContent}>
//               <Text style={styles.categoryModalTitle}>Select Category</Text>
//               <FlatList
//                 data={categories}
//                 renderItem={({ item: category }) => (
//                   <TouchableOpacity
//                     style={styles.categoryItem}
//                     onPress={() => handleCategoryChange(category)}
//                   >
//                     <Text style={styles.categoryText}>{category.name}</Text>
//                   </TouchableOpacity>
//                 )}
//                 keyExtractor={item => item.id.toString()}
//               />
//               <TouchableOpacity
//                 style={styles.closeModalButton}
//                 onPress={() => setCategoryModalVisible(false)}
//               >
//                 <Text style={styles.closeModalButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </TouchableOpacity>
//   );
// }
