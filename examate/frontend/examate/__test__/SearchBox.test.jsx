import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBox from "@/components/Searchbox/SearchBox";

describe("SearchBox", () => {
  test("renders SearchBox component", () => {
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
  
    render(
      <SearchBox
      search="testSearch"
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

    const inputElement = screen.getByPlaceholderText(
      "What're you searching for?"
    );
    act(() => {
      fireEvent.change(inputElement, { target: { value: "newSearch" } });
    });

    expect(setSearchMock).toHaveBeenCalledWith("newSearch");
    expect(setUsersMock).not.toHaveBeenCalled();

    const searchButton = screen.getByTestId("search");
    act(() => {
      fireEvent.click(searchButton);
    });
    expect(setSearchMock).toHaveBeenCalledWith("newSearch");
    expect(handleSearchApiMock).toHaveBeenCalledWith("newSearch");
  });
  test("renders SearchBox component", () => {
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
  
    render(
      <SearchBox
      search="testSearch"
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

    const inputElement = screen.getByPlaceholderText(
      "What're you searching for?"
    );
    fireEvent.change(inputElement, { target: { value: "" } });

    const searchButton = screen.getByTestId("search");
    fireEvent.click(searchButton);

    expect(setSearchMock).toHaveBeenCalledWith("");
  
  });
});
