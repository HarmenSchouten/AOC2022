const text = await Deno.readTextFile("./Day7/input.txt")
const items = text.split("\r\n")

type File = {
    parent: Folder
    name: string
    size: number
}

type Folder = {
    key: string,
    name: string
    files: (File | Folder)[]
    parent?: Folder
}

const structure = {} as Folder

const folderTypeGuard = (file: any): file is Folder => {
    if (file.files !== undefined && Array.isArray(file.files)) {
        return true
    } else {
        return false
    }
}

const fileTypeGuard = (file: any): file is File => {
    if (file.size && typeof file.size === "number" && file.parent && folderTypeGuard(file.parent)) {
        return true
    } else {
        return false
    }
}

const addFolderToFolder = (folderKey: string, folder: Folder) => {
    // Recursive function to update a folder in a folder
    const updateFolder = (f: Folder) => {
        if (f.key === folderKey) {
            console.log("ADDING", folder, "parent", f)
            f.files.push({...folder, parent: f} as Folder)
            return true
        } else {
            for (const g of f.files) {
                if (folderTypeGuard(g)) {
                    if (updateFolder(g)) {
                        return true
                    }
                }
            }
        }
    }

    updateFolder(structure)

    return structure
}

const addFileToFolder = (folderKey: string, file: File) => {
    // Recursive function to update a file in a folder
    const updateFolder = (folder: Folder) => {
        if (folder.key === folderKey) {
            folder.files.push({...file, parent: folder} as File)
            return true
        } else {
            for (const f of folder.files) {
                if (folderTypeGuard(f)) {
                    if (updateFolder(f)) {
                        return true
                    }
                }
            }
        }
    }

    updateFolder(structure)

    return structure
}

const findParentFolder = (folderKey: string) => {
    
    let key = ""
    // Find a folder in a tree
    const findFolder = (folder: Folder) => {
        if (folder.key === folderKey) {
            console.log(folder)
            key = folder.parent!.key
            return true
        } else {
            for (const f of folder.files) {
                if (folderTypeGuard(f)) {
                    if (findFolder(f)) {
                        return true;
                    }
                }
            }
        }
    }

    const item = findFolder(structure)
    console.log("PARENT", key, item)

    return key
}

const findSubfolder = (folderKey: string, subfolderName:string) => {

    let key = "";

    const findFolder = (folder: Folder) => {

        if (folder.key === folderKey) {
            const item = folder.files.find(item => item.name === subfolderName)
            if (item && folderTypeGuard(item)) {
                console.log("ITEM", item, folderTypeGuard(item))
                key = item.key
                return true
            }
        }

        for (const f of folder.files) {
            if (folderTypeGuard(f)) {
                if (folder.key === folderKey) {
                    const item = folder.files.find(item => item.name === subfolderName)
                    if (item && folderTypeGuard(item)) {
                        console.log("ITEM", item, folderTypeGuard(item))
                        key = item.key
                        return true
                    }
                } else {
                    if (findFolder(f)) {
                        return true
                    }
                }
            }
        }
    }

    const folder = findFolder(structure)
    console.log("2", folder, key, folderKey, subfolderName)
    return key;
}

let currentDirKey = "";
items.forEach(item => {
    // Command
    if (item.startsWith("$")) {
        const [sign, cmd, dir] = item.split(" ");

        switch (cmd) {
            case "cd":
                if (dir === "..") {
                    currentDirKey = findParentFolder(currentDirKey);
                } else {
                    if (currentDirKey === "") {
                        const key = window.crypto.randomUUID()
                        structure.name = dir;
                        structure.key = key;
                        structure.files = [];
                        currentDirKey = key
                    } else {
                        const subFolder = findSubfolder(currentDirKey, dir)!
                        console.log("SUB", dir, subFolder)
                        currentDirKey = subFolder!
                    }
                }
                break;
            case "ls": 
                break;
        }
    } 
    // Create Direcotry
    else if (item.startsWith("dir")) {
        const [dir, name] = item.split(" ");
        console.log("ADD DIRECTORY", currentDirKey, name)
        const struct = addFolderToFolder(currentDirKey, {name: name, files: [], key: window.crypto.randomUUID()} as Folder)
    } 
    // Create file
    else {
        const [size, name] = item.split(" ");
        const struct = addFileToFolder(currentDirKey, {name, size: parseInt(size)} as File)
    }
});

type FolderSize = {
    name: string
    dirSize: number
    files?: (File | FolderSize)[]
}

const findDirectorySizes = (folder: Folder) => {
    const findSize = (folder: Folder): FolderSize => {
        let dirSize = 0;
        const files = folder.files.map(file => {
            if (folderTypeGuard(file)) {
                const found = findSize(file)
                dirSize += found.dirSize
                return found
            } else {
                dirSize += file.size;
                return file
            }
        })

        return {name: folder.name, dirSize, files}
    }

    return findSize(folder)
}

const findDirectoriesWithMaxSize = (folder: FolderSize, maxSize: number) => {
    const directories = [] as FolderSize[];

    const findDirectories = (folder: FolderSize) => {
        if (folder.dirSize <= maxSize) {
            directories.push(folder)
        } 

        if (folder.files) {
            folder.files.forEach(file => {
                if (!fileTypeGuard(file)) {
                    findDirectories(file)
                }
            })
        }
    }

    findDirectories(folder)

    return directories
}

const dirSizes = findDirectorySizes(structure)
const dirs = findDirectoriesWithMaxSize(dirSizes, 100000)
console.log(dirs.map(dir => ({name: dir.name, size: dir.dirSize})))
console.log(dirs.reduce((acc, item) => acc + item.dirSize, 0))