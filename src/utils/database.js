// Firebase Realtime Database utility functions
import { ref, push, set, onValue, off, remove } from 'firebase/database'
import { db } from '../firebase/config'

// Helper to get database reference
function getRef(path) {
  if (!db) {
    console.warn('Firebase database not initialized')
    return null
  }
  return ref(db, path)
}

// Write data to Firebase
export async function writeData(path, data) {
  try {
    const dbRef = getRef(path)
    if (!dbRef) return null
    await set(dbRef, data)
    return true
  } catch (error) {
    console.error('Error writing to database:', error)
    throw error
  }
}

// Push data to Firebase (creates new entry with auto-generated key)
export async function pushData(path, data) {
  try {
    const dbRef = getRef(path)
    if (!dbRef) return null
    const newRef = push(dbRef)
    await set(newRef, data)
    return newRef.key
  } catch (error) {
    console.error('Error pushing to database:', error)
    throw error
  }
}

// Read data from Firebase (returns promise, one-time read)
export function readData(path) {
  return new Promise((resolve, reject) => {
    const dbRef = getRef(path)
    if (!dbRef) {
      resolve(null)
      return
    }

    let resolved = false
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (!resolved) {
        resolved = true
        const data = snapshot.val()
        unsubscribe()
        resolve(data)
      }
    }, (error) => {
      if (!resolved) {
        resolved = true
        console.error('Error reading from database:', error)
        unsubscribe()
        reject(error)
      }
    })
  })
}

// Subscribe to data changes (returns unsubscribe function)
export function subscribeToData(path, callback) {
  const dbRef = getRef(path)
  if (!dbRef) {
    callback(null)
    return () => {}
  }

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val()
    callback(data)
  }, (error) => {
    console.error('Error subscribing to database:', error)
    callback(null)
  })

  // Return unsubscribe function
  return () => {
    off(dbRef)
  }
}

// Delete data from Firebase
export async function deleteData(path) {
  try {
    const dbRef = getRef(path)
    if (!dbRef) return false
    await remove(dbRef)
    return true
  } catch (error) {
    console.error('Error deleting from database:', error)
    throw error
  }
}

// Update specific field
export async function updateData(path, updates) {
  try {
    const dbRef = getRef(path)
    if (!dbRef) return false
    await set(dbRef, updates)
    return true
  } catch (error) {
    console.error('Error updating database:', error)
    throw error
  }
}


