import * as reservationService from '../services/reservation.service';

export const getReservations = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reservations = await reservationService.getReservations(restaurantId);
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reservations' });
  }
};

export const createReservation = async (req, res) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Error creating reservation' });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationService.updateReservation(id, req.body);
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Error updating reservation' });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    await reservationService.deleteReservation(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting reservation' });
  }
};
export const checkAvailability = async (req, res) => {
 try {
      const { restaurantId } = req.params;
      const { date, guests } = req.query;
      const availability = await reservationService.checkAvailability(restaurantId, date, guests);
      res.status(200).json(availability);
    } catch (error) {
      res.status(500).json({ error: 'Error checking availability' });
    }
  };
export const getCapacity = async (req, res) => {
 try {
      const { restaurantId } = req.params;
      const capacity = await reservationService.calculateCapacity(restaurantId);
      res.status(200).json(capacity);
    } catch (error) {
      res.status(500).json({ error: 'Error calculating capacity' });
    }
  };