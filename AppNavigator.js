import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AdminScreen from './screens/AdminScreen';
import UserScreen from './screens/UserScreen';
import AskQuestionScreen from './screens/AskQuestionScreen';
import AnsweredQuestionsScreen from './screens/AnsweredQuestionScreen';
import AnswerQuestionsScreen from './screens/AnswerQuestionScreen';
import ProfileScreen from './screens/ProfileScreen';
import CategoriesScreen from './screens/CategoriesScreen'; // New Categories screen
import Icon from 'react-native-vector-icons/FontAwesome';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import CategoryQuestionsScreen from './screens/CategoryQuestionsScreen';
import AnswerDetailsScreen from './screens/AnswerDetailsScreen'; // Adjust the import path as needed
import QuestionDetailScreen from './screens/QuestionDetailsScreen';
import AnswerDetailScreen from './screens/Fullscreenanswer';
import EditAnswerScreen from './screens/EditAnswerScreen';
import AdminUserScreen from './screens/AdminUsersScreen';
// Inside your navigation setup




const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// User Bottom Tab Navigator
const UserTabNavigator = () => {
  return (
    <Tab.Navigator
    initialRouteName="AnsweredQuestions"
      screenOptions={{
        tabBarActiveTintColor: '#00796b',
        tabBarInactiveTintColor: '#b0b0b0',
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Tab.Screen
        name="UserDashboard"
        component={UserScreen}
        options={{
          title: 'Questions',
          tabBarIcon: ({ color }) => <Icon name="question" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="AskQuestion"
        component={AskQuestionScreen}
        options={{
          title: 'Ask a Question',
          tabBarIcon: ({ color }) => <Icon name="plus-circle" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="AnsweredQuestions"
        component={AnsweredQuestionsScreen}
        options={{
          title: 'Answered Question',
          tabBarIcon: ({ color }) => <Icon name="check-circle" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Admin Bottom Tab Navigator
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#00796b',
        tabBarInactiveTintColor: '#b0b0b0',
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Tab.Screen
        name="PendingQuestions"
        component={AdminScreen}
        options={{
          title: 'Pending Questions',
          tabBarIcon: ({ color }) => <Icon name="hourglass-half" size={24} color={color} />,
        }}
      />
       <Tab.Screen
        name="AdminUserScreen"
        component={AdminUserScreen}
        options={{
          title: 'AdminUserScreen',
          tabBarIcon: ({ color }) => <Icon name="user-secret" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen} // Register Categories Screen
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Icon name="th-list" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="AnsweredQuestionsAdmin"
        component={AnsweredQuestionsScreen}
        options={{
          title: 'Answered Questions',
          tabBarIcon: ({ color }) => <Icon name="check-circle" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileAdmin"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        {/* User Tab Navigator */}
        <Stack.Screen
          name="UserScreen"
          component={UserTabNavigator}
          options={{ title: 'User Dashboard', headerShown: false }}
        />
        {/* Admin Tab Navigator */}
        <Stack.Screen
          name="AdminScreen"
          component={AdminTabNavigator}
          options={{ title: 'Admin Dashboard', headerShown: false }}
        />
        <Stack.Screen name="AskQuestionScreen" component={AskQuestionScreen} options={{ title: 'Ask a Question' }} />
        <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} options={{ title: 'OTP Verification' }} />
        <Stack.Screen name="AnswerQuestionScreen" component={AnswerQuestionsScreen} options={{ title: 'Answer Questions' }} />
        <Stack.Screen
          name="AnsweredQuestionsScreen"
          component={AnsweredQuestionsScreen}
          options={{ title: 'Answered Questions' }}
        />
        <Stack.Screen
          name="CategoryQuestionScreen"
          component={CategoryQuestionsScreen}
          options={{ title: 'Answered Questions' }}
        />
        <Stack.Screen name="AnswerDetails" component={AnswerDetailsScreen} />
        <Stack.Screen name="QuestionDetailScreen" component={QuestionDetailScreen} />
        <Stack.Screen name="Answerfull" component={AnswerDetailScreen} />
        <Stack.Screen name="EditAnswer" component={EditAnswerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
