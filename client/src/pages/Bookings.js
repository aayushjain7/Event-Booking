import React, { useContext, useEffect, useState } from 'react';
import BookingList from '../components/Bookings/BookingList/BookingList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';

function Bookings() {
	const [isLoading, setIsLoading] = useState(false);
	const [bookings, setBookings] = useState([]);
	const context = useContext(AuthContext);

	useEffect(() => {
		setIsLoading(true);
		const requestBody = {
			query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
             }
            }
          }
        `,
		};

		fetch('http://localhost:5000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + context.token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then((resData) => {
				const bookings = resData.data.bookings;
				setBookings(bookings);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	}, []);

	const deleteBookingHandler = (bookingId) => {
		setIsLoading(true);
		const requestBody = {
			query: `
				mutation {
					cancelBooking(bookingId: "${bookingId}") {
					_id
					 title
					}
				}
			`,
		};

		fetch('http://localhost:5000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + context.token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then((resData) => {
				const updatedBookings = bookings.filter((booking) => booking._id !== bookingId);
				setBookings(updatedBookings);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	return <>{isLoading ? <Spinner /> : <BookingList bookings={bookings} onDelete={deleteBookingHandler} />}</>;
}

export default Bookings;
