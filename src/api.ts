import type {
  CreateLoadPayload,
  CreateTruckPayload,
  LoadDirection,
  UpdateLoadPayload,
  UpdateTruckPayload,
} from './types';

export const getLoadsByTruckId = async (truckId: string, direction: LoadDirection) => {
  const endpointURL = new URL(`/api/trucks/${truckId}/loads`, import.meta.env.VITE_API_URL);
  if (direction) {
    endpointURL.searchParams.set('direction', direction);
  }
  const response = await fetch(endpointURL.toString());
  return response.json();
};

export const getLoadById = async (id: string) => {
  const response = await fetch(`/api/loads/${id}`);
  return response.json();
};

export const createLoad = async (truckId: string, load: CreateLoadPayload) => {
  const response = await fetch(`/api/trucks/${truckId}/loads`, {
    method: 'POST',
    body: JSON.stringify(load),
  });
  return response.json();
};

export const updateLoad = async (loadId: string, load: UpdateLoadPayload) => {
  const response = await fetch(`/api/loads/${loadId}`, {
    method: 'PATCH',
    body: JSON.stringify(load),
  });
  return response.json();
};

export const deleteLoad = async (loadId: string) => {
  const response = await fetch(`/api/loads/${loadId}`, {
    method: 'DELETE',
  });
  return response.ok;
};

export const getTrucks = async () => {
  const response = await fetch('/api/trucks');
  return response.json();
};

export const getTruckById = async (id: string) => {
  const response = await fetch(`/api/trucks/${id}`);
  return response.json();
};

export const createTruck = async (truck: CreateTruckPayload) => {
  const response = await fetch('/api/trucks', {
    method: 'POST',
    body: JSON.stringify(truck),
  });
  return response.json();
};

export const updateTruck = async (id: string, truck: UpdateTruckPayload) => {
  const response = await fetch(`/api/trucks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(truck),
  });
  return response.json();
};

export const deleteTruck = async (id: string) => {
  const response = await fetch(`/api/trucks/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
};
