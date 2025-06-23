import React, { useState } from 'react';
import { View, Text, Button, FlatList, CheckBox, TextInput, StyleSheet } from 'react-native';

const App = () => {
  const [players, setPlayers] = useState([
    { name: 'אבי', rating: 9, selected: false },
    { name: 'בני', rating: 8, selected: false },
  ]);
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState('');
  const [screen, setScreen] = useState('select'); // 'select' או 'add'

  const selectPlayer = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].selected = !updatedPlayers[index].selected;
    setPlayers(updatedPlayers);
  };

  const addPlayer = () => {
    if (!newName || !newRating || isNaN(newRating) || newRating < 1 || newRating > 10) {
      alert('הזן שם ודירוג תקין (1-10)');
      return;
    }
    setPlayers([...players, { name: newName, rating: parseInt(newRating), selected: false }]);
    setNewName('');
    setNewRating('');
    setScreen('select');
  };

  const splitTeams = () => {
    const selectedPlayers = players.filter(p => p.selected);
    if (selectedPlayers.length < 4) {
      alert('בחר לפחות 4 שחקנים!');
      return;
    }
    const sortedPlayers = [...selectedPlayers].sort((a, b) => b.rating - a.rating);
    const teams = [[], [], [], []];
    for (let i = 0; i < sortedPlayers.length; i++) {
      teams[i % 4].push(sortedPlayers[i]);
    }
    const averages = teams.map(team => {
      const avg = team.reduce((sum, p) => sum + p.rating, 0) / team.length;
      return isNaN(avg) ? 0 : avg.toFixed(2);
    });
    alert(`קבוצה 1: ${teams[0].map(p => p.name).join(', ')} (ממוצע: ${averages[0]})\n` +
          `קבוצה 2: ${teams[1].map(p => p.name).join(', ')} (ממוצע: ${averages[1]})\n` +
          `קבוצה 3: ${teams[2].map(p => p.name).join(', ')} (ממוצע: ${averages[2]})\n` +
          `קבוצה 4: ${teams[3].map(p => p.name).join(', ')} (ממוצע: ${averages[3]})`);
  };

  return (
    <View style={styles.container}>
      {screen === 'select' ? (
        <>
          <Text style={styles.title}>בחר שחקנים</Text>
          <FlatList
            data={players}
            renderItem={({ item, index }) => (
              <View style={styles.playerItem}>
                <CheckBox value={item.selected} onValueChange={() => selectPlayer(index)} />
                <Text style={styles.playerText}>{item.name} - דירוג: {item.rating}</Text>
              </View>
            )}
            keyExtractor={(item) => item.name}
          />
          <Button title="חלק לקבוצות" onPress={splitTeams} />
          <Button title="הוסף שחקן" onPress={() => setScreen('add')} />
        </>
      ) : (
        <>
          <Text style={styles.title}>הוסף שחקן</Text>
          <TextInput
            style={styles.input}
            placeholder="שם השחקן"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="דירוג (1-10)"
            value={newRating}
            onChangeText={setNewRating}
            keyboardType="numeric"
          />
          <Button title="שמור שחקן" onPress={addPlayer} />
          <Button title="חזור" onPress={() => setScreen('select')} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  playerItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  playerText: { fontSize: 18, marginLeft: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default App;