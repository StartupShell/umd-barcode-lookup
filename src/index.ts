import { HttpFunction } from "@google-cloud/functions-framework"
import ldap from "ldapjs-promise"

export const main: HttpFunction = async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*")

    try {
        if (!("barcode" in req.query || "uid" in req.query)) {
            console.log("neither barcode nor uid provided")
            res.status(400)
            res.json({ error: "neither barcode nor uid provided" })
            return
        }

        const client = ldap.createClient({ url: process.env.LDAP_URL as string })
        const password = process.env.LDAP_PASSWORD!.replaceAll("\n", "")
        await client.bind(process.env.LDAP_DN as string, password)

        console.log("client binded")

        let searchKey
        let searchValue
        if ("barcode" in req.query) {
            searchKey = "umLibraryBarcode"
            searchValue = req.query["barcode"]
        } else {
            searchKey = "employeeNumber"
            searchValue = req.query["uid"]
        }

        let results = await client.searchReturnAll("ou=people,dc=umd,dc=edu", {
            filter: `(&(objectClass=*)(${searchKey}=${searchValue}))`,
            scope: "sub",
        })

        console.log("barcode lookup results: ", results)
        return res.json({ results })
    } catch (error) {
        console.error("uncaught error", error)
        res.status(500)
        res.json({ error: "internal server error" })
    }
}
