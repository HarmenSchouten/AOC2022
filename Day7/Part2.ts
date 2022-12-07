// deno-lint-ignore-file no-explicit-any
const text = await Deno.readTextFile("./Day7/input.txt")
const items = text.split("\r\n")

type File = {
    parent: Directory
    name: string
    size: number
}

type Directory = {
    key: string,
    name: string
    files: (File | Directory)[]
    parent?: Directory
}

type FolderSize = {
    name: string
    dirSize: number
    files?: (File | FolderSize)[]
}

/**
 * Setup the base structure
 */
const structure = {} as Directory

/**
 * Check if an object is of type Folder
 * @param item The item to validate
 * @returns A boolean whether this item is a folder or not
 */
const isFolder = (item: any): item is Directory => (item.files !== undefined && Array.isArray(item.files))

/**
 * Validate if an object is of type File
 * @param item The item to validate
 * @returns A boolean whether this item is a file or not
 */
const isFile = (item: any): item is File => (item.size && typeof item.size === 'number' && item.parent && isFolder(item.parent))

/**
 * Recursive function to add a directory to an existing parent directory
 * @param directoryKey The parent directory
 * @param directory The directory to add
 * @returns Nada
 */
const createDirectory = (directoryKey: string, directory: Directory) => {
    const createDir = (f: Directory) => {
        if (f.key === directoryKey) {
            f.files.push({...directory, parent: f} as Directory)
            return true
        } else {
            for (const g of f.files) {
                if (isFolder(g)) {
                    if (createDir(g)) {
                        return true
                    }
                }
            }
        }
    }

    createDir(structure)
}

/**
 * Recursive function to create a file in a specified directory
 * @param directoryKey The parent directory key
 * @param file The file to create
 * @returns Nada
 */
const createFile = (directoryKey: string, file: File) => {
    const addFile = (directory: Directory) => {
        if (directory.key === directoryKey) {
            directory.files.push({...file, parent: directory} as File)
            return true
        } else {
            for (const f of directory.files) {
                if (isFolder(f)) {
                    if (addFile(f)) {
                        return true
                    }
                }
            }
        }
    }

    addFile(structure)
}

/**
 * Get the key of the parent folder for a certain directory key
 * @param directoryKey The dir key to look for
 * @returns The key of the parent directory
 */
const findParent = (directoryKey: string) => {
    const findFolder = (folder: Directory):string|undefined => {
        if (folder.key === directoryKey) {
            return folder.parent!.key
        } else {
            for (const f of folder.files) {
                if (isFolder(f)) {
                    if (findFolder(f)) {
                        return findFolder(f)
                    }
                }
            }
        }
    }

    return findFolder(structure)
}

/**
 * Find the key of a subdirectory
 * @param folderKey The folderkey of the parent
 * @param subfolderName The subdirectory name
 * @returns The key of the subdirectory
 */
const findSubfolder = (folderKey: string, subfolderName:string) => {
    const findFolder = (folder: Directory):string|undefined => {
        if (folder.key === folderKey) {
            const item = folder.files.find(item => item.name === subfolderName)
            if (item && isFolder(item)) {
                return item.key
            }
        } else {
            for (const f of folder.files) {
                if (isFolder(f)) {
                    if (findFolder(f)) {
                        return findFolder(f)
                    }
                }
            }
        }
    }

    return findFolder(structure);
}

/**
 * Get for a certain directory structure the size of each directory
 * using a recursive function
 * @param directory The directory to get all the sizes for
 * @returns A tree object with all directory sizes
 */
const getDirectorySizes = (directory: Directory) => {
    const findSize = (dir: Directory): FolderSize => {
        let dirSize = 0;
        const files = dir.files.map(file => {
            if (isFolder(file)) {
                const found = findSize(file)
                dirSize += found.dirSize
                return found
            } else {
                dirSize += file.size;
                return file
            }
        })

        return {name: dir.name, dirSize, files}
    }

    return findSize(directory)
}

/**
 * Find all directories with a size that is smaller than the given size
 * @param directory The directory in which to start looking
 * @param maxSize The max size of the directory
 * @returns An array with directories
 */
const findDirectoriesWithMaxSize = (directory: FolderSize, maxSize: number) => {
    const directories = [] as FolderSize[];

    const findDirectories = (dir: FolderSize) => {
        if (dir.dirSize <= maxSize) {
            directories.push(dir)
        } 

        if (dir.files) {
            dir.files.forEach(file => {
                if (!isFile(file)) {
                    findDirectories(file)
                }
            })
        }
    }

    findDirectories(directory)

    return directories
}

/**
 * Setup the directory structure
 */
let currentDirKey = "";
items.forEach(item => {
    if (item.startsWith("$")) {
        const [_, cmd, dir] = item.split(" ");

        switch (cmd) {
            case "cd":
                if (dir === "..") {
                    currentDirKey = findParent(currentDirKey)!;
                } else {
                    if (currentDirKey === "") {
                        const key = window.crypto.randomUUID()
                        structure.name = dir;
                        structure.key = key;
                        structure.files = [];
                        currentDirKey = key
                    } else {
                        currentDirKey = findSubfolder(currentDirKey, dir)!
                    }
                }
                break;
            case "ls":
                // Irrelevant 
                break;
        }
    } else if (item.startsWith("dir")) {
        const [_, name] = item.split(" ");
        createDirectory(currentDirKey, {name: name, files: [], key: window.crypto.randomUUID()} as Directory)
    } else {
        const [size, name] = item.split(" ");
        createFile(currentDirKey, {name, size: parseInt(size)} as File)
    }
});

// Get all directory sizes
const dirSizes = getDirectorySizes(structure)
const dirs = findDirectoriesWithMaxSize(dirSizes, Number.MAX_SAFE_INTEGER).sort((a, b) => a.dirSize - b.dirSize)
const reqFreeSpace = 30000000 - (70000000 - dirs[dirs.length - 1].dirSize)

let cleanupDir = 0
for (let i = 0; i < dirs.length; i++) {
    if (cleanupDir === 0) {
        if (dirs[i].dirSize >= reqFreeSpace)
        cleanupDir = dirs[i].dirSize
    }
}

console.log(cleanupDir)