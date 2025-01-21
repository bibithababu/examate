import React from "react"
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chatroom from '@/components/chatroom/Chatroom'
import {  viewProfile, getMessages, updateMessagesReadStatus } from '@/services/ApiServices'
import { useConsumer } from "@/context/consumerDetailsContext"
import {toast} from 'react-toastify'

global.WebSocket = jest.fn(() => ({
    onopen: jest.fn(),
    onclose: jest.fn(),
    send: jest.fn(),
    onmessage: jest.fn(),
    close: jest.fn(),
  }));


const localStorageMock={
    getItem:jest.fn(),
    setItem:jest.fn(),
    removeItem:jest.fn()
}




  jest.mock('@/context/receiverContext', () => ({
    useReceiver: jest.fn().mockReturnValue({
      clientId: 10 , 
      setClientValue: jest.fn(), 
    }),
  }));
  jest.mock('@/context/messageStatusContext', () => ({
    useMessageStatus: jest.fn().mockReturnValue({
      userId: 10 , 
     
    }),
  }));

  jest.mock('@/context/consumerDetailsContext', () => ({
    useConsumer: jest.fn().mockReturnValue({
      consumerProfile: '1.jpg' ,
      consumerName:'ConsumerName',
      adminProfile:'2.jpg' 
     
    }),
  }));


jest.mock("@/services/ApiServices", () => ({
    viewProfile:jest.fn(),
    getMessages: jest.fn(),
    updateMessagesReadStatus: jest.fn()

  }));

  jest.mock('react-toastify', () => ({
    ...jest.requireActual('react-toastify'),
    toast: {
      POSITION:{TOP_CENTER:jest.fn()},
      success: jest.fn(),
      error: jest.fn(),
      dismiss: jest.fn(),
      warning:jest.fn()
    },
  }));

const userprofile=(profile=null)=>{
    useConsumer.mockImplementation(
        jest.fn().mockReturnValue({
            consumerProfile:profile,
            adminProfile:profile
        })
    )
} 

describe('ChatRoom componet',()=>{
    beforeEach(() => {
        jest.clearAllMocks();
   
        
      });

    
    
    test('renders chatroom with send message functionality', async () => {

        
       
        viewProfile.mockResolvedValue({ data: { id:123,user_type: 1,username:"Examate" } });
        const mockMessagesResponse = {
            data: [
                { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
                { id: 2, message: 'Message 2',flag:1,date: new Date().toISOString() }
            ]
        };
        getMessages.mockResolvedValue(mockMessagesResponse);
        
        await act(async () => {
            render(<Chatroom />);
          });
       
          const mockWebSocketInstance = {
            onopen: jest.fn(),
            onclose: jest.fn(),
            send: jest.fn(),
            onmessage: jest.fn(),
            close: jest.fn(),
        };
        
        global.WebSocket.mockImplementationOnce((url) => {
          
            return mockWebSocketInstance;
        });
    

        await act(async()=>{
            await waitFor(() => expect(screen.getByText('Examate')).toBeInTheDocument());
        })
    
       
        
    
        userEvent.type(screen.getByPlaceholderText('Type your message'), 'Test message');
       
        userEvent.click(screen.getByText('Send'));
       
        
      
})


test('renders chatroom with send message functionality with admin', async () => {

    Object.defineProperty(window,'localStorage',{value:localStorageMock})
    localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'authTokens') {
          return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
        }
        if(key === "user"){
            return JSON.stringify({ user: 'mockeduser' }); 
        }
        if(key === "admin"){
            return JSON.stringify({ admin: 'mockedadmin' }); 
        }
      });  
       
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 0,username:"Examate" } });
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: new Date().toISOString() }
        ]
    };
    getMessages.mockResolvedValue(mockMessagesResponse);
    
    await act(async () => {
        render(<Chatroom />);
      });
   
      const mockWebSocketInstance = {
        onopen: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        onmessage: jest.fn(),
        close: jest.fn(),
    };
    
    global.WebSocket.mockImplementationOnce((url) => {
     
        return mockWebSocketInstance;
    });


    await act(async()=>{
        await waitFor(() => expect(screen.getByText('Today')).toBeInTheDocument());
    })

   
    

    userEvent.type(screen.getByPlaceholderText('Type your message'), 'Test message');
   
    userEvent.click(screen.getByText('Send'));
   
    
  
})


test('renders chatroom with send message functionality with key down', async () => {
    Object.defineProperty(window,'localStorage',{value:localStorageMock})
    localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'authTokens') {
          return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
        }
        if(key === "user"){
            return JSON.stringify({ user: 'mockeduser' }); 
        }
        if(key === "admin"){
            return JSON.stringify({ admin: 'mockedadmin' }); 
        }
      });
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 1,username:"Examate" } });
    const today = new Date();
    const yesterDay = new Date();
    const otherDay=new Date()
    yesterDay.setDate(today.getDate() - 1)
    otherDay.setDate(today.getDate() - 2)
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: yesterDay.toISOString() },
            { id: 3, message: 'Message 3',flag:0,date: otherDay.toISOString() }
        ]
    };
    getMessages.mockResolvedValue(mockMessagesResponse);
    
    await act(async () => {
        render(<Chatroom />);
      });
   


    await act(async()=>{
        await waitFor(() => expect(screen.getByText('Examate')).toBeInTheDocument());
    })

    
    fireEvent.change(screen.getByPlaceholderText('Type your message'), {
      target: { value: 'Test message' },
    });

   
    fireEvent.keyDown(document, { key: 'Enter' });
   
})

test('renders chatroom with send message functionality with error', async () => {

    Object.defineProperty(window,'localStorage',{value:localStorageMock})
    localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'authTokens') {
          return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
        }
        if(key === "user"){
            return JSON.stringify({ user: 'mockeduser' }); 
        }
        if(key === "admin"){
            return JSON.stringify({ admin: 'mockedadmin' }); 
        }
      });
         
       
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 0,username:"Examate" } });
    const today = new Date();
    const yesterDay = new Date();
    const otherDay=new Date()
    yesterDay.setDate(today.getDate() - 1)
    otherDay.setDate(today.getDate() - 2)
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: yesterDay.toISOString() },
            { id: 3, message: 'Message 3',flag:0,date: otherDay.toISOString() }
        ]
    };
    getMessages.mockRejectedValue(new Error("Error in getting all messages"));
    
    await act(async () => {
        render(<Chatroom />);
      });
   
   

    fireEvent.change(screen.getByPlaceholderText('Type your message'), {
      target: { value: 'Test message' },
    });

    fireEvent.keyDown(document, { key: 'Enter' });
   
})

test('renders chatroom with send message functionality in consumer', async () => {
    Object.defineProperty(window,'localStorage',{value:localStorageMock})
localStorageMock.getItem.mockImplementation((key) => {
    if (key === 'authTokens') {
      return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
    }
    if(key === "user"){
        return JSON.stringify({ user: 'mockeduser' }); 
    }
    if(key === "admin"){
        return JSON.stringify({ admin: 'mockedadmin' }); 
    }
  });
  

        
       
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 1,username:"Consumer" } });
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: new Date().toISOString() }
        ]
    };
    getMessages.mockResolvedValue(mockMessagesResponse);
    
    await act(async () => {
        render(<Chatroom />);
      });
   
      const mockWebSocketInstance = {
        onopen: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        onmessage: jest.fn(),
        close: jest.fn(),
    };
    
    global.WebSocket.mockImplementationOnce((url) => {
       
        return mockWebSocketInstance;
    });
  

    userEvent.type(screen.getByPlaceholderText('Type your message'), 'Test message');
    userEvent.click(screen.getByText('Send'));

  
})
test('renders chatroom with send message functionality in conumer', async () => {

        
       
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 1,username:"Consumer" } });
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: new Date().toISOString() }
        ]
    };
    getMessages.mockResolvedValue(mockMessagesResponse);
    
    await act(async () => {
        render(<Chatroom />);
      });
   
      const mockWebSocketInstance = {
        onopen: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        onmessage: jest.fn(),
        close: jest.fn(),
    };
    
    global.WebSocket.mockImplementationOnce((url) => {
       
        return mockWebSocketInstance;
    });
    await act(async()=>{
        await waitFor(() => expect(screen.getByText('Examate')).toBeInTheDocument());
    })

    userEvent.type(screen.getByPlaceholderText('Type your message'), 'Test message');
    userEvent.click(screen.getByText('Send'));

  
})

test('renders chatroom with send message functionality in consumer with no profile', async () => {
    Object.defineProperty(window,'localStorage',{value:localStorageMock})
localStorageMock.getItem.mockImplementation((key) => {
    if (key === 'authTokens') {
      return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
    }
    if(key === "user"){
        return null
    }
    if(key === "admin"){
        return JSON.stringify({ admin: 'mockedadmin' }); 
    }
  });
  

        
       
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 1,username:"Consumer" } });
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: new Date().toISOString() }
        ]
    };
    getMessages.mockResolvedValue(mockMessagesResponse);
    
    await act(async () => {
        render(<Chatroom />);
      });
   
      const mockWebSocketInstance = {
        onopen: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        onmessage: jest.fn(),
        close: jest.fn(),
    };
    
    global.WebSocket.mockImplementationOnce((url) => {
      
        return mockWebSocketInstance;
    });
    userprofile()
    await act(async()=>{
        await waitFor(() => expect(screen.getByText('Examate')).toBeInTheDocument());
    })

    userEvent.type(screen.getByPlaceholderText('Type your message'), 'Test message');
    userEvent.click(screen.getByText('Send'));

  
})

test('renders chatroom with send message functionality in consumer with profile empty string', async () => {
    Object.defineProperty(window,'localStorage',{value:localStorageMock})
localStorageMock.getItem.mockImplementation((key) => {
    if (key === 'authTokens') {
      return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
    }
    if(key === "user"){
        return JSON.stringify({profileImage:'' }); 
    }
    if(key === "admin"){
        return JSON.stringify({ admin: 'mockedadmin' }); 
    }
  });
  

        
       
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 1,username:"Consumer" } });
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: new Date().toISOString() }
        ]
    };
    getMessages.mockResolvedValue(mockMessagesResponse);
    userprofile()
    await act(async () => {
        render(<Chatroom />);
      });
   
      const mockWebSocketInstance = {
        onopen: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        onmessage: jest.fn(),
        close: jest.fn(),
    };
    
    global.WebSocket.mockImplementationOnce((url) => {
       
        return mockWebSocketInstance;
    });
   
    await act(async()=>{
        await waitFor(() => expect(screen.getByText('Examate')).toBeInTheDocument());
    })

    userEvent.type(screen.getByPlaceholderText('Type your message'), 'Test message');
    userEvent.click(screen.getByText('Send'));

  
})

test('renders chatroom with send message functionality in consumer with user profile', async () => {
    Object.defineProperty(window,'localStorage',{value:localStorageMock})
localStorageMock.getItem.mockImplementation((key) => {
    if (key === 'authTokens') {
      return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
    }
    if(key === "user"){
        return JSON.stringify({profileImage:'' }); 
    }
    if(key === "admin"){
        return JSON.stringify({ admin: 'mockedadmin' }); 
    }
  });
  

        
       
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 1,username:"Consumer",profile_image:"1.jpg" } });
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: new Date().toISOString() }
        ]
    };
    getMessages.mockResolvedValue(mockMessagesResponse);
    userprofile()
    await act(async () => {
        render(<Chatroom />);
      });
   
      const mockWebSocketInstance = {
        onopen: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        onmessage: jest.fn(),
        close: jest.fn(),
    };
    
    global.WebSocket.mockImplementationOnce((url) => {
      
        return mockWebSocketInstance;
    });
   
    await act(async()=>{
        await waitFor(() => expect(screen.getByText('Examate')).toBeInTheDocument());
    })

    userEvent.type(screen.getByPlaceholderText('Type your message'), 'Test message');
    userEvent.click(screen.getByText('Send'));

  
})
test('renders chatroom with send message functionality in consumer with client id', async () => {
    Object.defineProperty(window,'localStorage',{value:localStorageMock})
localStorageMock.getItem.mockImplementation((key) => {
    if (key === 'authTokens') {
      return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
    }
    if(key === "user"){
        return JSON.stringify({profileImage:'' }); 
    }
    if(key === "admin"){
        return JSON.stringify({ admin: 'mockedadmin' }); 
    }
    if(key === "clientId"){
        return JSON.stringify({ client_id: 3 }); 
    }
  });
     
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 1,username:"Consumer",profile_image:"1.jpg" } });
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: new Date().toISOString() }
        ]
    };
    getMessages.mockResolvedValue(mockMessagesResponse);
    userprofile()
    await act(async () => {
        render(<Chatroom />);
      });
   
      const mockWebSocketInstance = {
        onopen: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        onmessage: jest.fn(),
        close: jest.fn(),
    };
    
    global.WebSocket.mockImplementationOnce((url) => {
      
        return mockWebSocketInstance;
    });
   
    await act(async()=>{
        await waitFor(() => expect(screen.getByText('Examate')).toBeInTheDocument());
    })

    userEvent.type(screen.getByPlaceholderText('Type your message'), 'Test message');
    userEvent.click(screen.getByText('Send'));

  
})
test('renders chatroom with send message functionality with error message', async () => {

    Object.defineProperty(window,'localStorage',{value:localStorageMock})
    localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'authTokens') {
          return JSON.stringify({ accessToken: 'mockedAccessToken' }); 
        }
        if(key === "user"){
            return JSON.stringify({ user: 'mockeduser' }); 
        }
        if(key === "admin"){
            return JSON.stringify({ admin: 'mockedadmin' }); 
        }
      });
         
       
    viewProfile.mockResolvedValue({ data: { id:123,user_type: 0,username:"Examate" } });
    const today = new Date();
    const yesterDay = new Date();
    const otherDay=new Date()
    yesterDay.setDate(today.getDate() - 1)
    otherDay.setDate(today.getDate() - 2)
    const mockMessagesResponse = {
        data: [
            { id: 1, message: 'Message 1' ,flag:0,date: new Date().toISOString()},
            { id: 2, message: 'Message 2',flag:1,date: yesterDay.toISOString() },
            { id: 3, message: 'Message 3',flag:0,date: otherDay.toISOString() }
        ]
    };
    getMessages.mockRejectedValue({
        response: {
            data: {
                message: 'mocked error',
                errorCode: "E40024"
            }
        }
      });
    
    await act(async () => {
        render(<Chatroom />);
      });
   
    await act(async()=>{
        expect(toast.error).toHaveBeenCalledWith('mocked error',{"autoClose": 2000});
    })

    fireEvent.change(screen.getByPlaceholderText('Type your message'), {
      target: { value: 'Test message' },
    });

   
    fireEvent.keyDown(screen.getByPlaceholderText('Type your message'), { key: 'Enter' });
   
})
})