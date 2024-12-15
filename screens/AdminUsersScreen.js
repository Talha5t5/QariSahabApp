import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';

const AdminUserScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await api.delete(`/users/admin/users/${userId}`);
              Alert.alert('Success', 'User deleted successfully.');
              fetchUsers();
            } catch (error) {
              console.error('Failed to delete user:', error.response ? error.response.data : error.message);
              Alert.alert('Error', 'Failed to delete user.');
            }
          },
        },
      ]
    );
  };

  const handleRoleChange = async (userId, newRole) => {
    Alert.alert(
      'Confirm Role Change',
      `Are you sure you want to change the role to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await api.put(`/users/admin/users/${userId}/role`, { role: newRole });
              Alert.alert('Success', `User role updated to ${newRole}.`);
              fetchUsers();
            } catch (error) {
              console.error('Failed to update role:', error.response ? error.response.data : error.message);
              Alert.alert('Error', 'Failed to update user role.');
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (userId, isActive) => {
    const newStatus = !isActive;
    Alert.alert(
      'Confirm Status Change',
      `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await api.put(`/users/admin/users/${userId}/status`, { isActive: newStatus });
              Alert.alert('Success', `User status updated to ${newStatus ? 'Active' : 'Inactive'}.`);
              fetchUsers();
            } catch (error) {
              console.error('Failed to update status:', error.response ? error.response.data : error.message);
              Alert.alert('Error', 'Failed to update user status.');
            }
          },
        },
      ]
    );
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (searchTerm.toLowerCase() === 'active' && user.isActive) ||
    (searchTerm.toLowerCase() === 'inactive' && !user.isActive)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Users</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Name, Email, or Status "
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#388E3C" />
      ) : filteredUsers.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.noUsersText}>No users available.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.userName}>Name: {item.name || 'Unknown'}</Text>
              <Text style={styles.userEmail}>Email: {item.email || 'No Email'}</Text>
              <Text style={styles.userRole}>Current Role: {item.role || 'User'}</Text>
              <Text style={styles.userStatus}>
                Status: {item.isActive ? 'Active' : 'Inactive'}
              </Text>

              <Picker
                selectedValue={item.role}
                style={styles.rolePicker}
                onValueChange={(newRole) => handleRoleChange(item._id, newRole)}
              >
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDeleteUser(item._id)}
                >
                  <Icon name="trash-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: item.isActive ? '#4CAF50' : '#d32f2f' }]}
                  onPress={() => handleToggleActive(item._id, item.isActive)}
                >
                  <Icon name={item.isActive ? 'checkmark-circle-outline' : 'close-circle-outline'} size={20} color="white" />
                  <Text style={styles.buttonText}>{item.isActive ? 'Deactivate' : 'Activate'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#388E3C',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noUsersText: {
    fontSize: 16,
    color: '#2E7D32',
  },
  userItem: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2E7D32',
  },
  userEmail: {
    fontSize: 14,
    color: '#388E3C',
  },
  userRole: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 8,
  },
  userStatus: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 8,
  },
  rolePicker: {
    height: 50,
    width: 150,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
});

export default AdminUserScreen;
