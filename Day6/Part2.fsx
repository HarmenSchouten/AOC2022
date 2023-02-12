module Part2 =

    let cutOffLength = 14
    let mutable marker:int = 0
    let mutable tracker:array<string> = Array.empty

    let _answer =  
        System.IO.File.ReadAllText("./Day6/input.txt")
        |> fun line -> line.Split [|'\n'|]
        |> fun lines -> lines[0]
        |> Seq.iteri(fun idx char ->
            if marker = 0 then
                tracker <- Array.append tracker [|char |> string|]
                if tracker.Length = cutOffLength then
                    if tracker |> Seq.toList |> Seq.distinct |> Seq.length = cutOffLength then
                        marker <- (idx + 1)
                    else 
                        tracker <- tracker |> Array.skip 1
        )
        |> fun _ -> marker