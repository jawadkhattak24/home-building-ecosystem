import styles from "./styles/savedItems.module.scss";

const SavedItemsPage = () => {
  return (
    <>
      <div className={styles.savedItemsParentContainer}>
        <h2 className={styles.heading}>You don't have any saved items...</h2>
      </div>
    </>
  );
};

export default SavedItemsPage;
