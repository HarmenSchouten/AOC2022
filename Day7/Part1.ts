const text = await Deno.readTextFile("./Day7/input.txt")
const items = text.split("\r\n")

type File = {
    parent: Folder
    name: string
    size: number
}

type Folder = {
    name: string
    files: (File | Folder)[]
    parent?: Folder
}

const structure = {} as Folder

const folderTypeGuard = (file: any): file is Folder => {
    if (file.files && Array.isArray(file.files)) {
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

const addFolderToFolder = (folderName: string, folder: Folder) => {
    // Recursive function to update a folder in a folder
    const updateFolder = (f: Folder) => {
        if (f.name === folderName) {
            f.files.push({...folder, parent: f})
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

const addFileToFolder = (folderName: string, file: File | Folder) => {
    // Recursive function to update a file in a folder
    const updateFolder = (folder: Folder) => {
        if (folder.name === folderName) {
            folder.files.push({...file, parent: folder})
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

const findParentFolder = (folderName: string) => {

    console.log("NAME", folderName)
    
    // Find a folder in a tree
    const findFolder = (folder: Folder) => {
        for (const f of folder.files) {
            if (folderTypeGuard(f)) {
                if (f.name === folderName) {
                    return folder
                } else {
                    return findFolder(f)
                }
            }
        }
    }

    return findFolder(structure)
}

let currentDirName = "";
items.forEach(item => {
    if (item.startsWith("$")) {
        const [sign, cmd, dir] = item.split(" ");

        switch (cmd) {
            case "cd":
                if (dir === "..") {
                    console.log(currentDirName)
                    currentDirName = findParentFolder(currentDirName)?.name ?? "/"
                } else {
                    if (currentDirName === "") {
                        structure.name = dir;
                        structure.files = [];
                    } else {
                        addFolderToFolder(currentDirName, {name: dir, files: []})
                    }
                    currentDirName = dir;
                }
                break;
            case "ls": 
                break;
        }
    } else if (item.startsWith("dir")) {
        const [dir, name] = item.split(" ");
        //addFolderToFolder(currentDirName, {name, files: []} as Folder)
    } else {
        const [size, name] = item.split(" ");
        addFileToFolder(currentDirName, {name, size: parseInt(size)} as File)
    }
});

//console.log(structure)

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

// console.log(structure)

const dirSizes = findDirectorySizes(structure)
const dirs = findDirectoriesWithMaxSize(dirSizes, 100000)
console.log(dirs)
console.log(dirs.reduce((acc, item) => acc += item.dirSize, 0))