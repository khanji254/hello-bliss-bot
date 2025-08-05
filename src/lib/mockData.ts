import { Course, User, Student, Teacher, Badge } from '@/types/user';

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'Alex Student',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'teacher@example.com', 
    name: 'Dr. Sarah Johnson',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date('2023-06-15')
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date('2023-01-01')
  }
];

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: 'first_circuit',
    name: 'Circuit Builder',
    description: 'Built your first circuit in the simulator',
    icon: '⚡',
    earnedAt: new Date('2024-01-15')
  },
  {
    id: 'ros_rookie',
    name: 'ROS Rookie',
    description: 'Completed your first ROS simulation',
    icon: '🤖',
    earnedAt: new Date('2024-02-01')
  },
  {
    id: 'code_master',
    name: 'Code Master',
    description: 'Wrote 100 lines of robot control code',
    icon: '💻',
    earnedAt: new Date('2024-02-15')
  }
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'course_1',
    title: 'Introduction to Robotics',
    description: 'Learn the fundamentals of robotics including sensors, actuators, and basic programming.',
    teacherId: '2',
    teacherName: 'Dr. Sarah Johnson',
    price: 49.99,
    duration: '4 weeks',
    level: 'beginner',
    category: 'programming',
    thumbnail: '/placeholder-course-1.jpg',
    rating: 4.8,
    studentsCount: 1250,
    tags: ['beginner', 'fundamentals', 'sensors'],
    modules: [
      {
        id: 'mod_1_1',
        title: 'What is Robotics?',
        description: 'Introduction to the field of robotics',
        type: 'video',
        duration: 20,
        completed: false
      },
      {
        id: 'mod_1_2',
        title: 'Basic Circuit Building',
        description: 'Learn to build your first circuit',
        type: 'simulation',
        duration: 45,
        completed: false
      },
      {
        id: 'mod_1_3',
        title: 'Knowledge Check',
        description: 'Test your understanding',
        type: 'quiz',
        duration: 15,
        completed: false
      }
    ]
  },
  {
    id: 'course_2',
    title: 'Advanced ROS Programming',
    description: 'Master Robot Operating System with advanced topics like navigation and computer vision.',
    teacherId: '2',
    teacherName: 'Dr. Sarah Johnson',
    price: 99.99,
    duration: '8 weeks',
    level: 'advanced',
    category: 'ros',
    thumbnail: '/placeholder-course-2.jpg',
    rating: 4.9,
    studentsCount: 485,
    tags: ['advanced', 'ROS', 'navigation', 'computer vision'],
    modules: [
      {
        id: 'mod_2_1',
        title: 'ROS Architecture Deep Dive',
        description: 'Understanding nodes, topics, and services',
        type: 'video',
        duration: 35,
        completed: false
      },
      {
        id: 'mod_2_2',
        title: 'Navigation Stack Setup',
        description: 'Configure robot navigation in simulation',
        type: 'simulation',
        duration: 60,
        completed: false
      }
    ]
  },
  {
    id: 'course_3',
    title: 'Circuit Design Masterclass',
    description: 'From basic circuits to complex electronic systems for robotics applications.',
    teacherId: '2',
    teacherName: 'Dr. Sarah Johnson',
    price: 79.99,
    duration: '6 weeks',
    level: 'intermediate',
    category: 'circuits',
    thumbnail: '/placeholder-course-3.jpg',
    rating: 4.7,
    studentsCount: 890,
    tags: ['circuits', 'electronics', 'PCB design'],
    modules: [
      {
        id: 'mod_3_1',
        title: 'Electronic Components Overview',
        description: 'Learn about resistors, capacitors, and more',
        type: 'video',
        duration: 25,
        completed: false
      },
      {
        id: 'mod_3_2',
        title: 'Digital Logic Circuits',
        description: 'Build and test logic gates',
        type: 'simulation',
        duration: 40,
        completed: false
      }
    ]
  }
];

// Mock Student Data
export const mockStudent: Student = {
  ...mockUsers[0],
  role: 'student',
  enrolledCourses: ['course_1', 'course_2'],
  completedCourses: ['course_1'],
  badges: mockBadges,
  totalPoints: 1250,
  level: 5
};

// Mock Teacher Data
export const mockTeacher: Teacher = {
  ...mockUsers[1],
  role: 'teacher',
  courses: ['course_1', 'course_2', 'course_3'],
  totalEarnings: 15420.50,
  rating: 4.8,
  specializations: ['ROS', 'Circuit Design', 'Programming'],
  verified: true
};

// API Mock Functions
export const apiMock = {
  // Auth
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return user;
  },

  register: async (userData: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date()
    } as User;
    return newUser;
  },

  // Courses
  getCourses: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses;
  },

  getCourseById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCourses.find(course => course.id === id);
  },

  // User Data
  getStudentData: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStudent;
  },

  getTeacherData: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTeacher;
  }
};
