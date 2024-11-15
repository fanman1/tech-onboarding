import React, { useEffect, useState } from "react";
import { apiUrl, Service, useAuth } from "@hex-labs/core";
import { SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import UserCard from "./UserCard";

const UserData: React.FC = () => {

  // The useState hook is used to store state in a functional component. The
  // first argument is the initial value of the state, and the second argument
  // is a function that can be used to update the state. The useState hook
  // returns an array with the first element being the state and the second
  // element being the function to update the state.

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI4Y2FjOTViNGE1YWNkZTBiOTY1NzJkZWU4YzhjOTVlZWU0OGNjY2QiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQWFyb24gRmFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xWbjdwX0RISTdFal9TYVdPMDgtUktleHhqdkFTd2NvSzFYc0ZsUXVJeGNDZVR6bW9vPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2hleGxhYnMtY2xvdWQiLCJhdWQiOiJoZXhsYWJzLWNsb3VkIiwiYXV0aF90aW1lIjoxNzMxNDMwNjU5LCJ1c2VyX2lkIjoiS0Q4bGd6b094NmJrTlJ1RGRuTTZjWlhpZzljMiIsInN1YiI6IktEOGxnem9PeDZia05SdURkbk02Y1pYaWc5YzIiLCJpYXQiOjE3MzE0MzA2NTksImV4cCI6MTczMTQzNDI1OSwiZW1haWwiOiJhaWx1bi5hYXJvbi5mYW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTE2MDA4ODIzMTc5OTEyOTQyNjkiXSwiZW1haWwiOlsiYWlsdW4uYWFyb24uZmFuQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.T80Du5cyvSQ5ZxQ6-kYhLcR5zivIs52MUDbRcwYKR5vbrYdGNv9RYHG2cwW38gBX0NR_Fq7FBVi8bK4JwvljLi2FJJquQMo-00co4gTA9mwMNBiNL7Jl526dzAK7oJod19kXwMvw8Xx5DTC9hTuAmNlgYmnIJ5xhL65QdlkKohY2EORL7BvLpEP6NFWr7r4v4_YKSCWin5R1rWy_5KB6m0nNnUlKhDOJD02oiHeQlE53Grbnc1qM7he3RlmxFXIABqsqdMCcQQrjAJqSwVGeULsb1oDTawM32GTkrMLcilYPxlqTEEusJ3R_hEBOCMkL-NjFRc3vF-z6Nk6spNu5wg'
  // The useEffect hook basicaly runs the code inside of it when the component
  // mounts. This is useful for making API calls and other things that should
  // only happen once when the component is loaded.

  useEffect(() => {

    // This is an example of an async function. The async keyword tells the
    // function to wait for the axios request to finish before continuing. This
    // is useful because we can't use the data from the request until it is
    // finished.

    const getUsers = async () => {
      setLoading(true);
      // this is the endpoint you want to hit, but don't just hit it directly using axios, use the apiUrl() function to make the request
      const URL = 'https://users.api.hexlabs.org/users/hexlabs';
      try {
        const url = apiUrl(Service.USERS, '/users/hexlabs');
        
        const response = await axios.get(url, {
          params: {
            limit: 100,
          },
          // headers: {
          //   Authorization: `Bearer ${accessToken}`,
          // },
        });

        const profiles = response?.data?.data?.profiles || [];
        setUsers(profiles);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    document.title = "Hexlabs Users";
    getUsers();
  }, []);
  // ^^ The empty array at the end of the useEffect hook tells React that the
  // hook should only run once when the component is mounted. If you want it to
  // run every time a variable changes, you can put that variable in the array
  // and it will run every time that variable changes.


  // TODO: Create a function that sorts the users array based on the first name of the users. Then, create a button that
  // calls this function and sorts the users alphabetically by first name. You can use the built in sort() function to do this.

  const sortUsersByFirstName = () => {
    if (!users) return;
    const sortedUsers = [...users].sort((a, b) => 
      (a.firstName || '').localeCompare(b.firstName || '')
    );
    setUsers(sortedUsers);
  };

  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl">This is an example of a page that makes an API call to the Hexlabs API to get a list of users.</Text>

      <button onClick={sortUsersByFirstName}>Sort by First Name</button>

      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>
        {loading ? (
          <Text>Loading users...</Text>
        ) : users?.length > 0 ? (
          users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        ) : (
          <Text>No users found</Text>
        )}
      </SimpleGrid>
    </>
  );
};

export default UserData;