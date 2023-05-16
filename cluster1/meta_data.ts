import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
  createCreateMetadataAccountV2Instruction,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

import * as bs58 from "bs58";
import wallet from "./wba-wallet";
const keypair = Keypair.fromSecretKey(bs58.decode(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Define our Mint address
const mint = new PublicKey("EyxG8ew7LyVqweJAMeGy3wwaZPtiKWcyCSRXaiJzmkEe");

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Create PDA for token metadata
const metadata_seeds = [
  Buffer.from("metadata"),
  token_metadata_program_id.toBuffer(),
  mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
  metadata_seeds,
  token_metadata_program_id
);

(async () => {
  try {
    let tx = new Transaction().add(
      createCreateMetadataAccountV3Instruction(
        {
          metadata: metadata_pda,
          mint: mint,
          mintAuthority: keypair.publicKey,
          payer: keypair.publicKey,
          updateAuthority: keypair.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: {
              name: "zonak art",
              symbol: "ZAN",
              uri: "https://v74boriqcgyk3qy6rhq6olwraphrym4a4ozn2trlbasus4ata6kq.arweave.net/r_gXRRARsK3DHonh5y7RA88cM4Djst1OKwglSXATB5U",
              sellerFeeBasisPoints: 500,
              creators: [
                { address: keypair.publicKey, verified: true, share: 100 },
              ],
              collection: null,
              uses: null,
            },
            isMutable: true,
            collectionDetails: null,
          },
        }
      )
    );

    let txhash = await sendAndConfirmTransaction(connection, tx, [keypair]);
    console.log("Success ...!!", txhash);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();

// Output - 5WmvoCkL5MeGLywPtytG8r7ULhDbgrA3XrSJhFzBh1GuVuAeEWPWwjkGDNaFeZ6gPCXaDKLtSibz2p634nr1izQD
// After you check 5QDLDG6k5iKc8rFH5pB6bsifEQZtwYjoDrojZX3yW1Lq on explorer you will find that the name has been updataed from unknow to something cool
