import { HttpFunction } from "@google-cloud/functions-framework"
import ldap from "ldapjs-promise"

export const main: HttpFunction = async (req, res) => {
    try {
        if (!("barcode" in req.query)) {
            console.log("barcode not provided in query")
            res.status(400)
            res.json({ error: "barcode value not provided" })
            return
        }

        const client = ldap.createClient({ url: process.env.LDAP_URL as string })
        const password = process.env.LDAP_PASSWORD!.replaceAll("\n", "")
        await client.bind(process.env.LDAP_DN as string, password)
        console.log("client binded")

        const barcode = req.query["barcode"]
        console.log("looking up barcode: ", barcode)
        const results = await client.searchReturnAll("ou=people,dc=umd,dc=edu", {
            filter: `(&(objectClass=*)(umLibraryBarcode=${barcode}))`,
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
