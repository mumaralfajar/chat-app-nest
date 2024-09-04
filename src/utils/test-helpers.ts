export const generateTestString = (str: string) => `${str} ${new Date().getTime()}`;

export const generateTestUserName = () => generateTestString('User Test');

export const generateTestPassword = () => generateTestString('strongPassword123!');

export const generateTestChatRoomName = () => generateTestString('Chat Room Test');

export const generateTestMessage = () => generateTestString('Message Test');
