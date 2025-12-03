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
    if (!dbRef) {
      console.error('❌ writeData: Database reference is null for path:', path)
      throw new Error('Database not initialized')
    }
    console.log('💾 writeData: Writing to path:', path)
    console.log('📦 writeData: Data:', data)
    await set(dbRef, data)
    console.log('✅ writeData: Successfully wrote to:', path)
    return true
  } catch (error) {
    console.error('❌ writeData: Error writing to database:', error)
    console.error('writeData: Path was:', path)
    console.error('writeData: Error code:', error.code, 'Message:', error.message)
    throw error
  }
}

// Push data to Firebase (creates new entry with auto-generated key)
export async function pushData(path, data) {
  try {
    const dbRef = getRef(path)
    if (!dbRef) {
      console.error('❌ pushData: Database reference is null for path:', path)
      return null
    }
    console.log('💾 pushData: Pushing to path:', path)
    console.log('📦 pushData: Data:', data)
    const newRef = push(dbRef)
    await set(newRef, data)
    console.log('✅ pushData: Successfully pushed to:', path, 'Key:', newRef.key)
    return newRef.key
  } catch (error) {
    console.error('❌ pushData: Error pushing to database:', error)
    console.error('pushData: Path was:', path, 'Error code:', error.code)
    throw error
  }
}

// Read data from Firebase (returns promise, one-time read)
export function readData(path) {
  return new Promise((resolve, reject) => {
    const dbRef = getRef(path)
    if (!dbRef) {
      console.warn('readData: Database reference is null for path:', path)
      resolve(null)
      return
    }

    let resolved = false
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true
        console.warn('readData: Timeout reading from path:', path)
        unsubscribe()
        resolve(null) // Return null on timeout instead of rejecting
      }
    }, 10000) // 10 second timeout

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (!resolved) {
        resolved = true
        clearTimeout(timeout)
        const data = snapshot.val()
        unsubscribe()
        resolve(data)
      }
    }, (error) => {
      if (!resolved) {
        resolved = true
        clearTimeout(timeout)
        console.error('readData: Error reading from database:', error)
        console.error('readData: Path was:', path, 'Error code:', error?.code)
        unsubscribe()
        // Don't reject - return null so the code can handle missing data
        resolve(null)
      }
    })
  })
}

// Subscribe to data changes (returns unsubscribe function)
export function subscribeToData(path, callback) {
  const dbRef = getRef(path)
  if (!dbRef) {
    console.error('❌ subscribeToData: Database reference is null for path:', path)
    callback(null)
    return () => {}
  }

  console.log('👂 subscribeToData: Subscribing to path:', path)
  
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val()
    console.log('📥 subscribeToData: Received data from:', path, data ? 'Has data' : 'No data (null)')
    callback(data)
  }, (error) => {
    console.error('❌ subscribeToData: Error subscribing to database:', error)
    console.error('subscribeToData: Path was:', path)
    console.error('subscribeToData: Error code:', error?.code, 'Message:', error?.message)
    callback(null)
  })

  // Return unsubscribe function
  return () => {
    console.log('🔇 subscribeToData: Unsubscribing from:', path)
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


