import { render,renderHook, screen, fireEvent, waitFor,act } from "@testing-library/react";
import { usePagination } from "@/hooks/usePagination";
import {  toast } from 'react-toastify';
import userEvent from "@testing-library/user-event";
import ConsumersList from "@/components/Consumerslist/ConsumersList";
import SearchBox from "@/components/Searchbox/SearchBox";
import {
  fetchConsumersDetails,
  switchUserAccountStatus,
  deleteUserAccount,
  searchbyName,
} from "@/services/ApiServices";
import { Pagination } from "react-bootstrap";

jest.mock("@/services/ApiServices", () => ({
  fetchConsumersDetails: jest.fn(),
  switchUserAccountStatus: jest.fn(),
  deleteUserAccount: jest.fn(),
  searchbyName: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    POSITION:{TOP_CENTER:jest.fn()},
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

jest.mock('@/context/receiverContext', () => ({
  useReceiver: jest.fn().mockReturnValue({
    clientId: 10 , 
    setClientValue: jest.fn(), 
  }),
}));

jest.mock('@/context/consumerDetailsContext', () => ({
  useConsumer: jest.fn().mockReturnValue({
    consumerProfile: '1.jpg' ,
    adminProfile:'2.jpg' 
   
  }),
}));

jest.mock('@/context/messageStatusContext', () => ({
  useMessageStatus: jest.fn().mockReturnValue({
    userId: 10 , 
   
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === 'candidate_id') {
        return 'test_candidate_id'
      }

    })
  }))
}))


const ORGANIZATION_USERS_ENDPOINT = "/examate/organization/users";
const TestComponent = ({ totalCount, pageSize, siblingCount, currentPage }) => {
  const paginationRange = usePagination({
    totalCount,
    pageSize,
    siblingCount,
    currentPage,
  });

  return <div data-testid="pagination">{JSON.stringify(paginationRange)}</div>;
};

describe("ConsumersList Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component", async () => {
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 1,
      },
    });
    render(<ConsumersList />);
    await waitFor(() => {
      expect(screen.getByText("Organization list")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Address")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
      expect(screen.getByText("user@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("useraddress")).toBeInTheDocument();
      expect(screen.getByText("9535646786")).toBeInTheDocument();
    });
  });
  test("renders the component with pagination", async () => {
    const mockProps = {
      onPageChange: jest.fn(),
      setCurrentPage: jest.fn(),
      totalCount: 10, 
      siblingCount: 1,
      currentPage: 1,
      pageSize: 1,
    };
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User1",
            email: "user1@gmail.com",
            address: "useraddress1",
            contact_number: "9535646786",
            status: 0,
            is_register: 0,
          },
          {
            id: 2,
            username: "User2",
            email: "user2@gmail.com",
            address: "useraddress2",
            contact_number: "9535646784",
            status: 0,
            is_register: 0,
          }
        ],
        next: null,
        previous: null,
        total_pages: 2,
      },
    });
    render(<ConsumersList />);
   
    
    await waitFor(() => {
      expect(screen.getByText("Organization list")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Address")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
      expect(screen.getByText('Prev')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    
    });
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Prev'))
   
    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(1);
    });
  });




  test("renders the component with pagination dots", async () => {
    const mockProps = {
      onPageChange: jest.fn(),
      setCurrentPage: jest.fn(),
      totalCount: 10, 
      siblingCount: 1,
      currentPage: 1,
      pageSize: 1,
    };
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User1",
            email: "user1@gmail.com",
            address: "useraddress1",
            contact_number: "9535646786",
            status: 0,
            is_register: 0,
          },
          {
            id: 2,
            username: "User2",
            email: "user2@gmail.com",
            address: "useraddress2",
            contact_number: "9535646784",
            status: 0,
            is_register: 0,
          }
        ],
        next: null,
        previous: null,
        total_pages: 10,
      },
    });
    render(<ConsumersList />);
   
    
    await waitFor(() => {
      expect(screen.getByText("Organization list")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Address")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
      expect(screen.getByText('Prev')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('…')).toBeInTheDocument();
    
    });
    fireEvent.click(screen.getByText('Next'))
    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(1);
    });
    await waitFor(()=>{
      fireEvent.click(screen.getByText('Prev'))
    })
  
    
   
    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(1);
    });
  });




  test("handles user status change from block to unblock", async () => {
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 1,
      },
    });

    render(<ConsumersList />);
    

    switchUserAccountStatus.mockResolvedValueOnce({
      data: { message: "The user has been unblocked" },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText("Unblock"));
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText("Confirm Updation", { selector: ".btn" }));
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("The user has been unblocked", {"autoClose": 2000});
    });
  });

  test("handles user status change from unblock to block", async () => {
    const initialUserData = {
      id: 1,
      username: "User",
      email: "user@gmail.com",
      address: "useraddress",
      contact_number: "9535646786",
      status: 1,
      is_register: 1,
    };
  
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [initialUserData],
        next: null,
        previous: null,
        total_pages: 1,
      },
    });
  
    render(<ConsumersList />);
    switchUserAccountStatus.mockResolvedValueOnce({
      data: { message: "The user has been blocked" },
    });
  
    
    await waitFor(() => {
      fireEvent.click(screen.getByText("Block"));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText("Confirm Updation", { selector: ".btn" }));
    });
  
   
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("The user has been blocked", {"autoClose": 2000});
      expect(screen.getByText(initialUserData.email)).toBeInTheDocument();
      expect(screen.getByText("Unblock")).toBeInTheDocument();
      expect(screen.getByText(initialUserData.address)).toBeInTheDocument();
      expect(screen.getByText(initialUserData.contact_number)).toBeInTheDocument();
    });
  });
  
  test("handles user status updation error", async () => {
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 1,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 1,
      },
    });

    render(<ConsumersList />);
    switchUserAccountStatus.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } });

    await waitFor(() => {
      fireEvent.click(screen.getByText("Block"));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText("Confirm Updation", { selector: ".btn" }));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Mocked error", {"autoClose": 2000});
    });
  });

 
  // test("handles pagination", async () => {
  //   const mockResponse = {
  //     data: {
  //       results: [
  //         {
  //           id: 1,
  //           username: "user",
  //           email: "user@gmail.com.com",
  //           address: "useraddress",
  //           contact_number: "9535646786",
  //           status: 0,
  //           is_register: 1,
  //         },
  //       ],
  //       next: "/examate/organization/users?page=2",
  //       previous: null,
  //       total_pages: 2,
  //     },
  //   };

  //   fetchConsumersDetails.mockResolvedValueOnce(mockResponse);
  //   render(<ConsumersList />);

  //   userEvent.click(screen.getByText("Next"));

  //   await waitFor(() => {
  //     expect(fetchConsumersDetails).toHaveBeenCalledWith(
  //       "/examate/organization/users",
  //       { ascending: true, sort_by: "username" }
  //     );
  //   });
  // });

  test("handles sorting by default", async () => {
    const mockUsers = [
      {
        id: 1,
        username: "User1",
        email: "user1@gmail.com",
        address: "useraddress1",
        contact_number: "9535646786",
        status: 0,
        is_register: 1,
      },
      {
        id: 2,
        username: "User2",
        email: "user2@gmail.com",
        address: "useraddress2",
        contact_number: "9535646786",
        status: 0,
        is_register: 1,
      },
    ];
    const mockResponse = {
      data: {
        results: [
          {
            id: 1,
            username: "User1",
            email: "user1@gmail.com",
            address: "useraddress1",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
          {
            id: 2,
            username: "User2",
            email: "user2@gmail.com",
            address: "useraddress2",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 1,
      },
    };
    fetchConsumersDetails.mockResolvedValueOnce(mockResponse);
    render(<ConsumersList />);

    await waitFor(() => {
      expect(screen.getByText("User1")).toBeInTheDocument();
      expect(screen.getByText("User2")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(3);
      const rows = screen.getAllByRole("row").map((row) => row.textContent);
      expect(rows).toEqual([
        "Sl.NoNameEmailAddressContact",
        "1User1user1@gmail.comuseraddress19535646786Unblock",
        "2User2user2@gmail.comuseraddress29535646786Unblock",
      ]);
    });
  });

  test("renders table rows with user data", async () => {
    const mockUsers = [
      {
        id: 1,
        username: "User1",
        email: "user1@gmail.com",
        address: "useraddress1",
        contact_number: "9535646786",
        status: 0,
        is_register: 1,
      },
      {
        id: 2,
        username: "User2",
        email: "user2@gmail.com",
        address: "useraddress2",
        contact_number: "9535646780",
        status: 1,
        is_register: 1,
      },
    ];

    const mockResponse = {
      data: {
        results: mockUsers,
        next: null,
        previous: null,
        total_pages: 1,
      },
    };

    fetchConsumersDetails.mockResolvedValueOnce(mockResponse);
    render(<ConsumersList />);

    await waitFor(() => {
      mockUsers.map((user, index) => {
        expect(screen.getByText(user.username)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
        expect(screen.getByText(user.address)).toBeInTheDocument();
        expect(screen.getByText(user.contact_number)).toBeInTheDocument();

        if (user.is_register === 1) {
          const row = screen.getByText(user.username).closest("tr");
          expect(screen.getByText(user.username)).toBeInTheDocument();
          expect(screen.getByText(user.email)).toBeInTheDocument();
          expect(screen.getByText(user.address)).toBeInTheDocument();
          expect(screen.getByText(user.contact_number)).toBeInTheDocument();
        } else {
          expect(screen.getByText(user.username)).not.toBeInTheDocument();
          expect(screen.getByText(user.email)).not.toBeInTheDocument();
          expect(screen.getByText(user.address)).not.toBeInTheDocument();
          expect(screen.getByText(user.contact_number)).not.toBeInTheDocument();
        }
      });
    });
  });

  test("renders table rows with user data", async () => {
    const mockUsers = [
      {
        id: 1,
        username: "User1",
        email: "user1@gmail.com",
        address: "useraddress1",
        contact_number: "9535646786",
        status: 0,
        is_register: 0,
      },
      {
        id: 2,
        username: "User2",
        email: "user2@gmail.com",
        address: "useraddress2",
        contact_number: "9535646780",
        status: 1,
        is_register: 0,
      },
    ];

    const mockResponse = {
      data: {
        results: mockUsers,
        next: null,
        previous: null,
        total_pages: 1,
      },
    };

    fetchConsumersDetails.mockResolvedValueOnce(mockResponse);
    render(<ConsumersList />);

    await waitFor(() => {
      expect(screen.queryByText("user1@gmail.com")).not.toBeInTheDocument();
      expect(screen.queryByText("user1")).not.toBeInTheDocument();
      expect(screen.queryByText("useraddress1")).not.toBeInTheDocument();
    });
  });

 
  test("handle delete function", async () => {
    const mockDeleteResponse = {
      data: { message: "User deleted successfully" },
    };
    const mockFetchResponse = {
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
          {
            id: 2,
            username: "Use2",
            email: "user2@gmail.com",
            address: "useraddress2",
            contact_number: "9535546786",
            status: 0,
            is_register: 1,
          }
        ],
        next: null,
        previous: null,
        total_pages: 0,
      },
    };

    deleteUserAccount.mockResolvedValue(mockDeleteResponse);
    fetchConsumersDetails.mockResolvedValue(mockFetchResponse);

    render(<ConsumersList />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("delete2"));
    });
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm Delete"));
    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).toBeNull();
      expect(toast.success).toHaveBeenCalledWith("User deleted successfully", {"autoClose": 2000});
      expect(fetchConsumersDetails).toHaveBeenCalledWith(
        "/examate/organization/users",
        { ascending: true, sort_by: "username" }
      );
    });
  });

  test("handle delete confirmation modal cancel function", async () => {
    const mockDeleteResponse = {
      data: { message: "User deleted successfully" },
    };
    const mockFetchResponse = {
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 0,
      },
    };

    deleteUserAccount.mockResolvedValue(mockDeleteResponse);
    fetchConsumersDetails.mockResolvedValue(mockFetchResponse);

    render(<ConsumersList />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("delete1"));
    });
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).toBeNull();
    });
  });

  test("handle delete function", async () => {
    const mockDeleteResponse = {
      data: { message: "User deleted successfully" },
    };
    const mockFetchResponse = {
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
          {
            id: 2,
            username: "User2",
            email: "user2@gmail.com",
            address: "useraddress2",
            contact_number: "9535646787",
            status: 0,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 0,
      },
    };

    deleteUserAccount.mockResolvedValue(mockDeleteResponse);
    fetchConsumersDetails.mockResolvedValue(mockFetchResponse);

    render(<ConsumersList />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("delete2"));
    });
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm Delete"));
    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).toBeNull();
      
      expect(fetchConsumersDetails).toHaveBeenCalledWith(
        "/examate/organization/users",
        { ascending: true, sort_by: "username" }
      );
    });
  });
  test("Handle delete error and show error message", async () => {
    const mockedError = new Error("Some error");
    const mockFetchResponse = {
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 0,
      },
    };

    fetchConsumersDetails.mockResolvedValue(mockFetchResponse);
    deleteUserAccount.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } });
    render(<ConsumersList />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("delete1"));
    });
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mocked error', {"autoClose": 2000});
    });
  });
  test("Handle pagination after delete with previous page", async () => {
    const mockFetchResponse = {
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
        ],
        next: "/examate/organization/users?page=2",
        previous: "/examate/organization/users?page=1",
        total_pages: 2,
      },
    };
    deleteUserAccount.mockResolvedValueOnce({
      data: { message: "Delete success" },
    });
    fetchConsumersDetails.mockResolvedValue(mockFetchResponse);

    render(<ConsumersList />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("delete1"));
    });

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm Delete"));
    await waitFor(() => {
      expect(fetchConsumersDetails).toHaveBeenCalledWith(
        "/examate/organization/users",
        { ascending: true, sort_by: "username" }
      );
    });
  });

  test("handles error message when no organizations are registered", async () => {
    const mockErrorResponse = {
      message: "No organizations are registered.",
    };
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
         
        ],
        next: null,
        previous: null,
        total_pages: 2,
      },
    });

    render(<ConsumersList />);

    await waitFor(() => {
      expect(
        screen.getByText("No organizations are registered")
      ).toBeInTheDocument();
    });
  });
  test("handles pagination when currentPage > 1 and no previous link", async () => {
    const mockUsers = [
      {
        id: 1,
        username: "User1",
        email: "user1@example.com",
        address: "Address1",
        contact_number: "1234567890",
        status: 0,
        is_register: 1,
      },
    ];

    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: mockUsers,
        next: null,
        previous: null,
        total_pages: 2,
      },
    });

    const { getByTestId } = render(<ConsumersList />);
    await waitFor(() => {
      fireEvent.click(getByTestId("delete1"));
    });

    fireEvent.click(screen.getByText("Confirm Delete"));

    await waitFor(() => {
      expect(fetchConsumersDetails).toHaveBeenCalledWith(
        `/examate/organization/users`,
        { ascending: true, sort_by: "username" }
      );
    });
  });
  test("clears search and sets users when input is empty", () => {
    
    const setSearchMock = jest.fn();
    const handleSearchApiMock = jest.fn();
    const setUsersMock = jest.fn();
    const setIsSearchEmptyMock = jest.fn();
    const setNoUser = jest.fn()
    const setSearchTerm=jest.fn()
    const handleFetchData=jest.fn()

    const mockOriginalUsers = [
      { id: 1, username: "user1", email: "user1@example.com" },
      { id: 2, username: "user2", email: "user2@example.com" },
    ];
    const mockUsers = [
      { id: 1, username: "user1", email: "user1@example.com" },
      { id: 3, username: "user3", email: "user3@example.com" },
    ];
  

    const { getByPlaceholderText, getByTestId } = render(
      <SearchBox
        search="some value"
        setSearch={setSearchMock}
        handleSearchApi={handleSearchApiMock}
        setUsers={setUsersMock}
        setIsSearchEmpty={setIsSearchEmptyMock}
        originalUsers={mockOriginalUsers}
        users={mockUsers}
        setNoUser={setNoUser}
        setSearchTerm={setSearchTerm}
        handleFetchData={handleFetchData}
      />
    );
  
  
    const inputElement = getByPlaceholderText("What're you searching for?");
    const searchButton = getByTestId("search");

    fireEvent.change(inputElement, { target: { value: "" } });
    fireEvent.click(searchButton);
  
    
    expect(setSearchMock).toHaveBeenCalledWith("");
    expect(setUsersMock).toHaveBeenCalledWith(mockOriginalUsers);
    expect(handleFetchData).toHaveBeenCalled();
   
  });

  test("calls handleFetchData when search input becomes blank", async() => {
    const setSearchMock = jest.fn();
    const handleSearchApiMock = jest.fn();
    const setUsersMock = jest.fn();
    const setIsSearchEmptyMock = jest.fn();
    const setNoUser = jest.fn();
    const setSearchTerm = jest.fn();
    const handleFetchData = jest.fn();
  
    const mockOriginalUsers = [
      { id: 1, username: "user1", email: "user1@example.com" },
      { id: 2, username: "user2", email: "user2@example.com" },
    ];
    const mockUsers = [
      { id: 1, username: "user1", email: "user1@example.com" },
      { id: 3, username: "user3", email: "user3@example.com" },
    ];
  
    const { getByPlaceholderText } = render(
      <SearchBox
        search="some value"
        setSearch={setSearchMock}
        handleSearchApi={handleSearchApiMock}
        setUsers={setUsersMock}
        setIsSearchEmpty={setIsSearchEmptyMock}
        originalUsers={mockOriginalUsers}
        users={mockUsers}
        setNoUser={setNoUser}
        setSearchTerm={setSearchTerm}
        handleFetchData={handleFetchData}
      />
    );
  
    const inputElement = getByPlaceholderText("What're you searching for?");
  
   
    fireEvent.change(inputElement, { target: { value: "" } });
    render(<ConsumersList />);
  
  
    expect(handleFetchData).toHaveBeenCalled();
    await waitFor(() => {
      expect(fetchConsumersDetails).toHaveBeenCalledWith("/examate/organization/users", {
        sort_by: "username",
        ascending: true
      });
    })
   
  });
  
  test("handles pagination when currentPage > 1 and updatedResponse.data.previous is falsy", async () => {
    const currentPage = 2; 
    const sortOrder = "asc"
    const sort_by="username"
    const updatedResponseData = {
      results: [
        {
          id: 2,
          username: "User2",
          email: "user2@gmail.com",
          address: "user2address",
          contact_number: "9535646787",
          status: 0,
          is_register: 1,
        },
      ],
      next: null,
      previous: "",
      total_pages: 2,
    };

    fetchConsumersDetails.mockResolvedValueOnce({
      data: updatedResponseData,
    });

    render(<ConsumersList />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("delete1")); 
    });

    await waitFor(() => {
      expect(fetchConsumersDetails).toHaveBeenCalledWith(
        "/examate/organization/users", {"ascending": true, "sort_by": "username"}
      );
    });
  });


  it('handles error response correctly', async () => {
   
    fetchConsumersDetails.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Some error message',
        },
      },
    });

    render(<ConsumersList />);


    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Some error message", { 'autoClose': 2000 });
  });
  });



  test('handles search API success', async () => {
    const mockSearchResult = {
      data: {
        results: [{ id: 1, username: 'user', email: 'user1@example.com' }],
      },
    };
    const mockResponse = {
      data: {
        results: [
          {
            id: 1,
            username: "user",
            email: "user@gmail.com.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
        ],
        next: "/examate/organization/users?page=2",
        previous: null,
        total_pages: 2,
      },
    };

  fetchConsumersDetails.mockResolvedValueOnce(mockResponse);

  searchbyName.mockResolvedValueOnce(mockSearchResult);

  await act(async () => {
    render(<ConsumersList />);
  });

    const searchInput =  screen.getByPlaceholderText("What're you searching for?")

    userEvent.type(searchInput, 'user');
  
    await waitFor(() => {
    
      expect(screen.getByText('user')).toBeInTheDocument(); 
    });
  });


  // test('handles search API error', async () => {
  //   const mockSearchResult = {
  //     data: {
  //       results: [{ id: 1, username: 'user', email: 'user1@example.com' }],
  //     },
  //   };
  //   const mockResponse = {
  //     data: {
  //       results: [
  //         {
  //           id: 1,
  //           username: "user",
  //           email: "user@gmail.com.com",
  //           address: "useraddress",
  //           contact_number: "9535646786",
  //           status: 0,
  //           is_register: 1,
  //         },
  //       ],
  //       next: "/examate/organization/users?page=2",
  //       previous: null,
  //       total_pages: 2,
  //     },
  //   };

  // fetchConsumersDetails.mockResolvedValueOnce(mockResponse);

  // searchbyName.mockRejectedValueOnce({ response: { data: { message: 'Mocked error' } } })
  // await act(async () => {
  //   render(<ConsumersList />);
  // });

  //   const searchInput =  screen.getByPlaceholderText("What're you searching for?")

  //   userEvent.type(searchInput, 'user');
  
  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith("Mocked error", { 'autoClose': 2000 });
  // });
  // });

  it("should handle sorting correctly", async () => {
    render(<ConsumersList />);
    const mockData = {
      data: {
        results: [
          { id: 1, username: "User1", email: "user1@example.com", address: "Address1" },
          { id: 2, username: "User2", email: "user2@example.com", address: "Address2" },
        ],
        total_pages: 1,
      },
    };

  

    fireEvent.click(screen.getByTestId("name-filter"));
    await waitFor(() => {
      expect(fetchConsumersDetails).toHaveBeenCalledWith("/examate/organization/users?page=1", {
        sort_by: "username",
        ascending: false,
      });
    });

  });

  test("handles user status change from block to unblock", async () => {
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 1,
      },
    });

    render(<ConsumersList />);

    switchUserAccountStatus.mockResolvedValueOnce({
      data: { message: "The user has been unblocked" },
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText("Unblock"));
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText("Cancel", { selector: ".btn" }));
    });
    await waitFor(() => {
      expect(screen.queryByTestId("user-status-modal")).toBeNull();
    }) 
  });

  it("handles pagination correctly when currentPage > 1 and no previous link", async () => {
    const mockData = {
      data: {
        results: [
          { id: 1, username: "User1", email: "user1@example.com", address: "Address1" },
          { id: 2, username: "User2", email: "user2@example.com", address: "Address2" },
        ],
        total_pages: 2,
      },
    };

    fetchConsumersDetails.mockResolvedValueOnce(mockData);
    await act(async () => {
      render(<ConsumersList />);
    });
    fireEvent.click(screen.getByText("2"));
    await waitFor(() => {
      expect(fetchConsumersDetails).toHaveBeenCalledWith("/examate/organization/users", {"ascending": true, "sort_by": "username"});
    });

  });

  it("toggles sorting order correctly", async() => {
    await act(async () => {
      render(<ConsumersList />);
    });

    fireEvent.click(screen.getByTestId("name-filter"));
    expect(screen.getByTestId("name-filter")).toHaveClass("filter-icon");
    fireEvent.click(screen.getByTestId("name-filter"));
    expect(screen.getByTestId("name-filter")).toHaveClass("filter-icon");
  });


  it('returns correct pagination range when shouldShowLeftDots is true and shouldShowRightDots is true', async() => {
    const totalCount = 10;
    const pageSize = 1;
    const siblingCount = 1;
    const currentPage = 5;

    const { getByTestId } = render(
      <TestComponent
        totalCount={totalCount}
        pageSize={pageSize}
        siblingCount={siblingCount}
        currentPage={currentPage}
      />
    );

    const expectedRange = [1, '...', 4, 5, 6,'...',10];
    const paginationElement = screen.getByTestId('pagination');
    const paginationRange = JSON.parse(paginationElement.textContent);
await waitFor(()=>{
  expect(paginationRange).toEqual(expectedRange);
})
   
  });


it('returns correct pagination range when shouldShowLeftDots is true and shouldShowRightDots is false', async() => {
    const totalCount = 10;
    const pageSize = 1;
    const siblingCount = 1;
    const currentPage = 7;

    const { getByTestId } = render(
      <TestComponent
        totalCount={totalCount}
        pageSize={pageSize}
        siblingCount={siblingCount}
        currentPage={currentPage}
      />
    );

    const expectedRange = [1, '...',6,7,8,9,10];
    const paginationElement = screen.getByTestId('pagination');
    const paginationRange = JSON.parse(paginationElement.textContent);
await waitFor(()=>{
  expect(paginationRange).toEqual(expectedRange);
})
   
  });

  test("calls handleSearchApi with correct value when input is not empty", () => {
    const setSearchMock = jest.fn();
    const handleSearchApiMock = jest.fn();
    const setUsersMock = jest.fn();
    const setIsSearchEmptyMock = jest.fn();
  
    const inputValue = "test value";
    
    const { getByPlaceholderText } = render(
      <SearchBox
        search=""
        setSearch={setSearchMock}
        handleSearchApi={handleSearchApiMock}
        setUsers={setUsersMock}
        setIsSearchEmpty={setIsSearchEmptyMock}
      />
    );
  
    const inputElement = getByPlaceholderText("What're you searching for?");
    
    fireEvent.change(inputElement, { target: { value: inputValue } });
    
    expect(handleSearchApiMock).toHaveBeenCalledWith(inputValue);
  });
  
  test("handles search API correctly",async()=>{
    const mockedResponse = {
      data:{
        results:[
          { id: 1, username: "user1", email: "user1@example.com" },
          { id: 2, username: "user2", email: "user2@example.com" },
        ]
      }
    }
    searchbyName.mockResolvedValue(mockedResponse)
    const {getByPlaceholderText,getByTestId} = render(<ConsumersList/>)

    const searchInput = getByPlaceholderText("What're you searching for?")
    fireEvent.change(searchInput,{target:{value:"searchTerm"}})

    const searchButton = getByTestId("search")
    fireEvent.click(searchButton)

    expect(searchbyName).toHaveBeenCalledWith("/examate/organization/searchuser/?search=searchTerm")
  })

  test("handles search API with error",async()=>{
    
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 1,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 1,
      },
    });
    const mockedResponse = {
      data:{
        results:[
          
        ]
      }
    }
    searchbyName.mockResolvedValue(mockedResponse)
    const {getByPlaceholderText,getByTestId} = render(<ConsumersList/>)

    const searchInput = getByPlaceholderText("What're you searching for?")
    fireEvent.change(searchInput,{target:{value:"searchTerm"}})

    const searchButton = getByTestId("search")
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByTestId("no-user-found")).toBeInTheDocument()
  });
  })

  test("handles search API with error",async()=>{
    const mockedResponse = {
      data:{
        results:[
          { id: 1, username: "user1", email: "user1@example.com" },
          { id: 2, username: "user2", email: "user2@example.com" },
        ]
      }
    }
    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 1,
            is_register: 1,
          },
        ],
        next: null,
        previous: null,
        total_pages: 1,
      },
    });
    searchbyName.mockRejectedValueOnce({ response: { data: { errorCode: 2007 } } })
    const {getByPlaceholderText,getByTestId} = render(<ConsumersList/>)

    const searchInput = getByPlaceholderText("What're you searching for?")
    fireEvent.change(searchInput,{target:{value:"searchTerm"}})

    const searchButton = getByTestId("search")
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network unable to connect to the server", {"autoClose": 2000});
  });
  })
  test("renders the component with search", async () => {
    const ORGANIZATION_SEARCH_ENDPOINT="/examate/organization/searchuser"

    fetchConsumersDetails.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          }, {
            id: 2,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          }
        ],
        next: "nextPage",
        previous: "prevPage",
        total_pages: 3,
      },
    });
     const mockedResponse = {
      data:{
        results:[
          { id: 1, username: "user1", email: "user1@example.com" },
          { id: 2, username: "user2", email: "user2@example.com" },
        ]
      }
    }
    searchbyName.mockResolvedValue(({
      data: {
        results: [
          {
            id: 1,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          }, {
            id: 2,
            username: "User",
            email: "user@gmail.com",
            address: "useraddress",
            contact_number: "9535646786",
            status: 0,
            is_register: 1,
          }
        ],
        next: "nextPage",
        previous: "prevPage",
        total_pages: 3,
      },
    }))
    await act(async () => {
      render(<ConsumersList />);
    });
    const searchTerm="searchTerm"

    const searchInput = screen.getByPlaceholderText("What're you searching for?")
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: searchTerm } });
    });

   
    const pageNumber="3"

    fireEvent.click(screen.getByText("3"))

    await waitFor(() => {
      expect(searchbyName).toHaveBeenCalledWith(`${ORGANIZATION_SEARCH_ENDPOINT}/?search=${searchTerm}&page=${pageNumber}`); 
    });
  });
});
